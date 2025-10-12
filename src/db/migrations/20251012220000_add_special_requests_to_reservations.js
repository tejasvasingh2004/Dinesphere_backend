export function up(knex) {
  return knex.schema.alterTable('reservations', function(table) {
    table.text('special_requests');
  });
}

export function down(knex) {
  return knex.schema.alterTable('reservations', function(table) {
    table.dropColumn('special_requests');
  });
}
