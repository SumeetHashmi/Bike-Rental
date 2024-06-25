import { Knex } from 'knex';

function up(knex: Knex) {
  return knex.schema.createTable('otpVerifications', (t) => {
    t.uuid('id').unique().defaultTo(knex.raw('gen_random_uuid()')).primary();
    t.uuid('userId').notNullable();
    t.integer('otp').notNullable();
    t.timestamp('createdAt').defaultTo(knex.fn.now());
    t.timestamp('updatedAt').defaultTo(knex.fn.now());

    t.foreign('userId').references('id').inTable('users');
  }).raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON "otpVerifications"
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
}

function down(knex: Knex) {
  return knex.schema.raw(`
    DROP TABLE "otpVerifications";
  `);
}

export { up, down };
