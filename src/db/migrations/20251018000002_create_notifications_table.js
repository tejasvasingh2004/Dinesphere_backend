export const up = async function(knex) {
  // notifications table
  await knex.schema.createTable('notifications', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    t.string('type', 50).notNullable();
    t.string('title', 255).notNullable();
    t.text('message').notNullable();
    t.uuid('reference_id');
    t.string('reference_type', 50);
    t.boolean('is_read').defaultTo(false);
    t.timestamps(true, true);
  });

  // notification_preferences table
  await knex.schema.createTable('notification_preferences', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    t.boolean('push_notifications').defaultTo(true);
    t.boolean('email_notifications').defaultTo(true);
    t.boolean('sms_notifications').defaultTo(false);
    t.boolean('booking_updates').defaultTo(true);
    t.boolean('order_status').defaultTo(true);
    t.boolean('promotions').defaultTo(true);
    t.boolean('loyalty_rewards').defaultTo(true);
    t.boolean('review_reminders').defaultTo(true);
    t.timestamps(true, true);
    
    // Ensure one preference record per user
    t.unique('user_id');
  });

  // Add indexes for performance
  await knex.schema.table('notifications', (t) => {
    t.index('user_id');
    t.index('is_read');
    t.index('created_at');
  });

  await knex.schema.table('notification_preferences', (t) => {
    t.index('user_id');
  });
};

export const down = async function(knex) {
  await knex.schema.dropTableIfExists('notification_preferences');
  await knex.schema.dropTableIfExists('notifications');
};

