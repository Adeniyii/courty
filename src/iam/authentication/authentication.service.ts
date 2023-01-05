import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ModelClass } from 'objection';
import { pgUniqueViolationErrorCode } from 'src/constants';
import { UserModel } from 'src/database/models/user.model';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('UserModel') private modelClass: ModelClass<UserModel>,
    private readonly hashingService: HashingService,
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

      return true;
    } catch (err) {
      throw err;
    }
  }
}
