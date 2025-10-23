export const up = async function(knex) {
  await knex.schema.createTable('carts', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    t.uuid('restaurant_id').references('id').inTable('restaurants').onDelete('CASCADE').notNullable();
    t.timestamps(true, true);
  });

  await knex.schema.createTable('cart_items', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('cart_id').references('id').inTable('carts').onDelete('CASCADE').notNullable();
    t.uuid('menu_item_id').references('id').inTable('menu_items').onDelete('CASCADE').notNullable();
    t.integer('quantity').notNullable().defaultTo(1);
    t.decimal('unit_price', 10, 2).notNullable();
    t.text('special_requests').nullable();
    t.timestamps(true, true);
  });

  // Add unique constraint to prevent duplicate cart items
  await knex.schema.alterTable('cart_items', (t) => {
    t.unique(['cart_id', 'menu_item_id']);
  });
};

export const down = async function(knex) {
  await knex.schema.dropTableIfExists('cart_items');
  await knex.schema.dropTableIfExists('carts');
};
