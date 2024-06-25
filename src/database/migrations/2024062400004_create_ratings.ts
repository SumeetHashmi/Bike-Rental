import { Knex } from 'knex';

function up(knex: Knex) {
  return knex.schema.createTable('ratings', (t) => {
    t.uuid('id').unique().defaultTo(knex.raw('gen_random_uuid()')).primary();
    t.uuid('userId').notNullable();
    t.uuid('bikeId').notNullable();
    t.string('rating').notNullable();
    t.timestamp('createdAt').defaultTo(knex.fn.now());
    t.timestamp('updatedAt').defaultTo(knex.fn.now());

    t.foreign('userId').references('id').inTable('users');
    t.foreign('bikeId').references('id').inTable('bikeDetails');
  }).raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON "ratings"
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
}

function down(knex: Knex) {
  return knex.schema.raw(`
    DROP TABLE "ratings";
  `);
}

export { up, down };
