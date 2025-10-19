export const up = async function(knex) {
  // user_favorites table
  await knex.schema.createTable('user_favorites', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    t.uuid('restaurant_id').references('id').inTable('restaurants').onDelete('CASCADE').notNullable();
    t.timestamps(true, true);
    
    // Ensure unique combination of user and restaurant
    t.unique(['user_id', 'restaurant_id']);
  });

  // Add indexes for performance
  await knex.schema.table('user_favorites', (t) => {
    t.index('user_id');
    t.index('restaurant_id');
  });
};

export const down = async function(knex) {
  await knex.schema.dropTableIfExists('user_favorites');
};

