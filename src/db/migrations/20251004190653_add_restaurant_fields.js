/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.alterTable('restaurants', (table) => {
    table.string('cuisine', 100);
    table.decimal('rating', 3, 2).defaultTo(0);
    table.string('price_range', 50);
    table.string('location', 255);
    table.string('image', 500);
    table.string('open_time', 100);
    table.integer('available_slots').defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.alterTable('restaurants', (table) => {
    table.dropColumn('cuisine');
    table.dropColumn('rating');
    table.dropColumn('price_range');
    table.dropColumn('location');
    table.dropColumn('image');
    table.dropColumn('open_time');
    table.dropColumn('available_slots');
  });
};
