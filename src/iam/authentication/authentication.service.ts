import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ModelClass } from 'objection';
import { pgUniqueViolationErrorCode } from 'src/constants';
import { UserModel } from 'src/database/models/user.model';
import jwtConfig from '../config/jwt.config';
import { HashingService } from '../hashing/hashing.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('UserModel') private modelClass: ModelClass<UserModel>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      const user = new this.modelClass();
      user.email = signUpDto.email;
      user.password = await this.hashingService.hash(signUpDto.password);

      await user.$query().insert();
    } catch (err) {
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException('Email already exists');
      }
      throw err;
    }
  }

  async signIn(signInDto: SignInDto) {
    try {
      const user = await this.modelClass
        .query()
        .findOne({ email: signInDto.email });

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

      const [accessToken, refreshToken] = await this.generateTokens(user);

      return { accessToken, refreshToken };
    } catch (err) {
      throw err;
    }
  }

  /**
   * Generates access and refresh tokens
   */
  async generateTokens(user: UserModel): Promise<[string, string]> {
    return await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl),
    ]);
  }

  /**
   * Refreshes access and refresh tokens
   */
  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        audience: this.jwtConfiguration.audience,
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.modelClass
        .query()
        .findById(sub)
        .throwIfNotFound();
      return this.generateTokens(user);
    } catch (err) {
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
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
