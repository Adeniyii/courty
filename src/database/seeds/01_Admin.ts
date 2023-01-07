import { Knex } from 'knex';
import { BcryptService } from '../../iam/hashing/bcrypt.service';

const tableName = 'users';

const bcryptService = new BcryptService();

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(tableName).del();

  // Inserts seed entries
  await knex(tableName).insert([
    {
      email: 'slimreaper@gmail.com',
      password: await bcryptService.hash('slimreaper'),
      role: 'admin',
    },
  ]);
}
