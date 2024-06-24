import { Knex } from 'knex';

function up(knex: Knex) {
  return knex.schema.createTable('users', (t) => {
    t.uuid('id').unique().defaultTo(knex.raw('gen_random_uuid()')).primary();
    t.string('firstName').notNullable();
    t.string('lastName').notNullable();
    t.string('email').notNullable();
    t.string('type').notNullable();
    t.string('password').notNullable();
    t.timestamp('createdAt').defaultTo(knex.fn.now());
    t.timestamp('updatedAt').defaultTo(knex.fn.now());
  }).raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON "users"
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
}

function down(knex: Knex) {
  return knex.schema.raw(`
    DROP TABLE "users";
  `);
}

export { up, down };
