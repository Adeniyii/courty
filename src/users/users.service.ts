import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModelClass, UniqueViolationError } from 'objection';
import { UserModel } from 'src/database/models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserModel') private readonly modelClass: ModelClass<UserModel>,
  ) {}

  /**
   * Create a user and return the created user
   */
  async create(createUserDto: CreateUserDto) {
    try {
      return await this.modelClass.query().insertAndFetch(createUserDto);
    } catch (err) {
      if (err instanceof UniqueViolationError) {
        throw new ConflictException('User already exists');
      }
      throw err;
    }
  }

  /**
   * Find all users with their addons and addon categories
   */
  findAll() {
    throw new HttpException(
      'Method not implemented',
      HttpStatus.NOT_IMPLEMENTED,
    );
  }

  /**
   * Find a user by id
   */
  async findOne(id: number) {
    return await this.modelClass.query().findById(id).throwIfNotFound();
  }

  /**
   * Find a user by email
   */
  findByEmail(email: string) {
    try {
      return this.modelClass.query().findOne({ email }).throwIfNotFound();
    } catch {
      throw new NotFoundException('User does not exist');
    }
  }

  /**
   * Update a user by id and return the updated user
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.modelClass
      .query()
      .findById(id)
      .patch(updateUserDto);
    return updatedUser;
  }

  /**
   * Remove a user by id
   */
  remove(id: number) {
    console.log(id);
    throw new HttpException(
      'Method not implemented',
      HttpStatus.NOT_IMPLEMENTED,
    );
  }
}
