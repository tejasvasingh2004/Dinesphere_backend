export const up = async function(knex) {
  // loyalty_points table
  await knex.schema.createTable('loyalty_points', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    t.integer('points').defaultTo(0).notNullable();
    t.string('tier', 20).defaultTo('bronze').notNullable();
    t.timestamps(true, true);
    
    // Ensure one loyalty account per user
    t.unique('user_id');
  });

  // rewards table
  await knex.schema.createTable('rewards', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('title', 255).notNullable();
    t.text('description');
    t.integer('points_required').notNullable();
    t.string('category', 50).notNullable();
    t.integer('valid_days').defaultTo(30);
    t.string('restaurant_type', 50).defaultTo('all');
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
  });

  // reward_redemptions table
  await knex.schema.createTable('reward_redemptions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    t.uuid('reward_id').references('id').inTable('rewards').onDelete('CASCADE').notNullable();
    t.integer('points_spent').notNullable();
    t.string('status', 20).defaultTo('active').notNullable();
    t.timestamp('redeemed_at').defaultTo(knex.fn.now());
    t.timestamp('expires_at');
    t.timestamp('used_at');
    t.timestamps(true, true);
  });

  // points_history table
  await knex.schema.createTable('points_history', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    t.integer('points').notNullable();
    t.string('action', 50).notNullable();
    t.uuid('reference_id');
    t.string('reference_type', 50);
    t.timestamps(true, true);
  });

  // Add indexes for performance
  await knex.schema.table('loyalty_points', (t) => {
    t.index('user_id');
  });

  await knex.schema.table('reward_redemptions', (t) => {
    t.index('user_id');
    t.index('reward_id');
    t.index('status');
  });

  await knex.schema.table('points_history', (t) => {
    t.index('user_id');
    t.index('created_at');
  });
};

export const down = async function(knex) {
  await knex.schema.dropTableIfExists('points_history');
  await knex.schema.dropTableIfExists('reward_redemptions');
  await knex.schema.dropTableIfExists('rewards');
  await knex.schema.dropTableIfExists('loyalty_points');
};

