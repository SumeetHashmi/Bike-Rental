import { Knex } from 'knex';

function up(knex: Knex) {
  return knex.schema.alterTable('bookingDates', (t) => {
    t.integer('rating');
  });
}

function down(knex: Knex) {
  return knex.schema.alterTable('bookingDates', (t) => {
    t.dropColumn('rating');
  });
}

export { up, down };
