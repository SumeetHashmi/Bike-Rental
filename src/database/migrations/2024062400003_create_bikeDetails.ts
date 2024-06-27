import { Knex } from 'knex';

function up(knex: Knex) {
  return knex.schema.createTable('bikeDetails', (t) => {
    t.uuid('id').unique().defaultTo(knex.raw('gen_random_uuid()')).primary();
    t.string('bikeModel').notNullable();
    t.string('bikeColor').notNullable();
    t.string('location').notNullable();
    t.boolean('status').notNullable().defaultTo(true);
    t.timestamp('createdAt').defaultTo(knex.fn.now());
    t.timestamp('updatedAt').defaultTo(knex.fn.now());
  }).raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON "bikeDetails"
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
}

function down(knex: Knex) {
  return knex.schema.raw(`
    DROP TABLE "bikeDetails";
  `);
}

export { up, down };
