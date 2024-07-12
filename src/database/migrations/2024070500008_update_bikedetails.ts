import { Knex } from 'knex';

function up(knex: Knex) {
  return knex.schema.alterTable('bikeDetails', (t) => {
    t.decimal('averageRating').defaultTo(0.0);
  });
}

function down(knex: Knex) {
  return knex.schema.alterTable('bikeDetails', (t) => {
    t.dropColumn('averageRating');
  });
}

export { up, down };
