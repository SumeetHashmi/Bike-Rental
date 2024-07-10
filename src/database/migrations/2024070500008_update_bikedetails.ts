import { Knex } from 'knex';

function up(knex: Knex) {
  return knex.schema.alterTable('bikeDetails', (t) => {
    t.string('AverageRating');
  });
}

function down(knex: Knex) {
  return knex.schema.alterTable('bikeDetails', (t) => {
    t.dropColumn('AverageRating');
  });
}

export { up, down };
