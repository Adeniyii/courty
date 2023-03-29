import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { ModelClass } from 'objection';
import { AppService } from 'src/app.service';
import { UserModel } from 'src/database/models/user.model';
import { UsersService } from 'src/users/users.service';
import jwtConfig from '../config/jwt.config';
import { HashingService } from '../hashing/hashing.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { InvalidatedTokenError, TokenIdsStorage } from './token-ids.storage';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('UserModel') private modelClass: ModelClass<UserModel>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly tokenIdsStorage: TokenIdsStorage,
    private readonly appService: AppService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const userFromDb = await this.modelClass
      .query()
      .findOne({ email: signUpDto.email });

    if (userFromDb) {
      throw new ConflictException('User already exists');
    }
    const password = await this.hashingService.hash(signUpDto.password);

    return await this.userService.create({ ...signUpDto, password });
  }

  async signIn(signInDto: SignInDto) {
    let user: UserModel;

    try {
      user = await this.userService.findByEmail(signInDto.email);
    } catch (err) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.generateTokens(user);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    let user: UserModel;

    try {
      user = await this.userService.findByEmail(forgotPasswordDto.email);
    } catch (err) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordResetToken = randomUUID();

    // set password reset token in redis
    await this.tokenIdsStorage.cacheForgotPasswordToken(
      user.id,
      passwordResetToken,
    );

    // send an email containing a link embedded with the generated token to the user to be used to change their password.
    const body = `<a href="http://courty.fly.dev/change-password/${passwordResetToken}">reset password</a>`;

    this.appService.sendEmail(user.email, 'Change password ✔', body);

    return { passwordResetToken };
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    let user: UserModel;
    let userId: number;

    try {
      userId = await this.tokenIdsStorage.validateForgotPasswordToken(
        changePasswordDto.tokenId,
      );

      user = await this.userService.findOne(userId);
    } catch (err) {
      if (err instanceof InvalidatedTokenError) {
        throw new UnauthorizedException('Invalid password-reset token');
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    try {
      const password = await this.hashingService.hash(
        changePasswordDto.newPassword,
      );
      this.userService.update(userId, { password });

      await this.tokenIdsStorage.invalidateForgotPasswordToken(
        changePasswordDto.tokenId,
      );
    } catch (error) {
      if (error instanceof InvalidatedTokenError) {
        throw new UnauthorizedException('Invalid password-reset token');
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    return { message: 'Password changed successfully' };
  }

  /**
   * Generates access and refresh tokens
   */
  async generateTokens(
    user: UserModel,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshTokenId = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email, role: user.role },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);
    await this.tokenIdsStorage.cacheRefreshToken(user.id, refreshTokenId);

    return { accessToken, refreshToken };
  }

  /**
   * Refreshes access and refresh tokens
   */
  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.modelClass
        .query()
        .findById(sub)
        .throwIfNotFound();

      const isRefreshTokenValid =
        await this.tokenIdsStorage.validateRefreshToken(
          user.id,
          refreshTokenId,
        );

      if (isRefreshTokenValid) {
        await this.tokenIdsStorage.invalidateRefreshToken(user.id);
      } else {
        throw new Error('Refresh token is invalid');
      }
      return await this.generateTokens(user);
    } catch (err) {
      if (err instanceof InvalidatedTokenError) {
        throw new UnauthorizedException('Access denied');
      }
      throw new UnauthorizedException();
    }
  }

  /**
   * Signs a token
   */
  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
