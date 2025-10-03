exports.up = async function(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto');

  // roles
  await knex.schema.createTable('roles', (t) => {
    t.increments('id').primary();
    t.string('name', 50).notNullable().unique();
  });

  // users
  await knex.schema.createTable('users', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('email', 254).notNullable().unique();
    t.text('password_hash');
    t.string('full_name', 200);
    t.string('phone', 30);
    t.integer('role_id').unsigned().notNullable().references('id').inTable('roles');
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
  });

  // restaurants
  await knex.schema.createTable('restaurants', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('owner_id').references('id').inTable('users').onDelete('SET NULL');
    t.string('name', 255).notNullable();
    t.text('description');
    t.string('website', 255);
    t.timestamps(true, true);
  });

  // menu_categories
  await knex.schema.createTable('menu_categories', (t) => {
    t.increments('id').primary();
    t.uuid('restaurant_id').references('id').inTable('restaurants').onDelete('CASCADE').notNullable();
    t.string('name', 120).notNullable();
    t.integer('position').defaultTo(0);
  });

  // menu_items
  await knex.schema.createTable('menu_items', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('restaurant_id').references('id').inTable('restaurants').onDelete('CASCADE').notNullable();
    t.integer('category_id').unsigned().references('id').inTable('menu_categories').onDelete('SET NULL');
    t.string('name', 255).notNullable();
    t.text('description');
    t.decimal('price', 10, 2).notNullable();
    t.string('currency', 10).defaultTo('INR');
    t.boolean('is_available').defaultTo(true);
    t.timestamps(true, true);
  });

  // reservations
  await knex.schema.createTable('reservations', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('restaurant_id').references('id').inTable('restaurants');
    t.uuid('user_id').references('id').inTable('users');
    t.integer('party_size').notNullable();
    t.string('status', 30).defaultTo('pending');
    t.timestamp('reservation_start').notNullable();
    t.timestamp('reservation_end');
    t.timestamps(true, true);
  });

  // orders
  await knex.schema.createTable('orders', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('restaurant_id').references('id').inTable('restaurants');
    t.uuid('user_id').references('id').inTable('users');
    t.decimal('total_amount', 10, 2).notNullable().defaultTo(0);
    t.string('status', 50).defaultTo('created');
    t.string('order_type', 20).defaultTo('dine_in');
    t.timestamps(true, true);
  });

  // order_items
  await knex.schema.createTable('order_items', (t) => {
    t.increments('id').primary();
    t.uuid('order_id').references('id').inTable('orders').onDelete('CASCADE');
    t.uuid('menu_item_id').references('id').inTable('menu_items');
    t.integer('quantity').defaultTo(1);
    t.decimal('unit_price', 10, 2);
    t.decimal('total_price', 10, 2);
  });

  // payments
  await knex.schema.createTable('payments', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('order_id').references('id').inTable('orders').onDelete('SET NULL');
    t.decimal('amount', 10, 2).notNullable();
    t.string('currency', 10).defaultTo('INR');
    t.string('provider', 50);
    t.string('provider_payment_id', 255);
    t.string('status', 30).defaultTo('pending');
    t.timestamps(true, true);
  });

  // reviews
  await knex.schema.createTable('reviews', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('restaurant_id').references('id').inTable('restaurants');
    t.uuid('user_id').references('id').inTable('users');
    t.smallint('rating');
    t.text('comment');
    t.timestamps(true, true);
  });

  // images
  await knex.schema.createTable('images', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('entity_type', 50).notNullable();
    t.uuid('entity_id').notNullable();
    t.text('url').notNullable();
    t.text('alt_text');
    t.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('images');
  await knex.schema.dropTableIfExists('reviews');
  await knex.schema.dropTableIfExists('payments');
  await knex.schema.dropTableIfExists('order_items');
  await knex.schema.dropTableIfExists('orders');
  await knex.schema.dropTableIfExists('reservations');
  await knex.schema.dropTableIfExists('menu_items');
  await knex.schema.dropTableIfExists('menu_categories');
  await knex.schema.dropTableIfExists('restaurants');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('roles');
  await knex.raw('DROP EXTENSION IF EXISTS pgcrypto');
};
