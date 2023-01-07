import type { Knex } from 'knex';

const tableName = 'addon_categories';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, (t) => {
    // this creates an "id" column that gets autoincremented
    t.increments('id').primary();

    t.string('name').notNullable();
    t.integer('brandId').unsigned().notNullable();
    t.timestamps(true, true);

    t.foreign('brandId').references('brands.id');
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
