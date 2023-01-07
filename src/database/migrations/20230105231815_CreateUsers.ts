import type { Knex } from 'knex';

const tableName = 'users';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, (t) => {
    // this creates an "id" column that gets autoincremented
    t.increments('id').primary();

    t.string('email').notNullable().unique();
    t.string('password').notNullable();
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
