import type { Knex } from 'knex';

enum Role {
  Admin = 'admin',
  Regular = 'regular',
}

const tableName = 'users';

export async function up(knex: Knex) {
  return knex.schema.table(tableName, (t) => {
    t.enum('role', Object.values(Role)).notNullable().defaultTo(Role.Regular);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
