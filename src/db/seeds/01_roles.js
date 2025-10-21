export async function seed(knex) {
  // Truncate all tables in reverse dependency order
  await knex.raw('TRUNCATE TABLE reviews CASCADE');
  await knex.raw('TRUNCATE TABLE payments CASCADE');
  await knex.raw('TRUNCATE TABLE order_items CASCADE');
  await knex.raw('TRUNCATE TABLE orders CASCADE');
  await knex.raw('TRUNCATE TABLE reservations CASCADE');
  await knex.raw('TRUNCATE TABLE menu_items CASCADE');
  await knex.raw('TRUNCATE TABLE menu_categories CASCADE');
  await knex.raw('TRUNCATE TABLE restaurants CASCADE');
  await knex.raw('TRUNCATE TABLE users CASCADE');
  await knex.raw('TRUNCATE TABLE roles CASCADE');

  // Inserts seed entries
  await knex('roles').insert([
    { id: 1, name: 'admin' },
    { id: 2, name: 'user' },
    { id: 3, name: 'restaurant_owner' }
  ]);
};
