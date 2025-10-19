export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('reward_redemptions').del();
  await knex('points_history').del();
  await knex('loyalty_points').del();
  await knex('rewards').del();

  // Inserts seed entries for rewards
  await knex('rewards').insert([
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      title: 'Free Appetizer',
      description: 'Get a complimentary appetizer with your meal',
      points_required: 500,
      category: 'food',
      valid_days: 30,
      restaurant_type: 'all',
      is_active: true
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      title: '20% Off Dinner',
      description: 'Enjoy 20% discount on your dinner bill',
      points_required: 800,
      category: 'discount',
      valid_days: 15,
      restaurant_type: 'premium',
      is_active: true
    },
    {
      id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      title: 'Free Dessert',
      description: 'Complimentary dessert of your choice',
      points_required: 300,
      category: 'food',
      valid_days: 45,
      restaurant_type: 'all',
      is_active: true
    },
    {
      id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      title: 'VIP Table Booking',
      description: 'Reserve a premium table with priority seating',
      points_required: 1200,
      category: 'experience',
      valid_days: 60,
      restaurant_type: 'select',
      is_active: true
    },
    {
      id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
      title: 'Free Main Course',
      description: 'Get any main course item free with your order',
      points_required: 1000,
      category: 'food',
      valid_days: 30,
      restaurant_type: 'all',
      is_active: true
    },
    {
      id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
      title: '30% Off Weekend',
      description: 'Special weekend discount of 30% on your bill',
      points_required: 1500,
      category: 'discount',
      valid_days: 7,
      restaurant_type: 'premium',
      is_active: true
    }
  ]);

  // Initialize loyalty accounts for existing users
  await knex('loyalty_points').insert([
    {
      id: '11111111-1111-1111-1111-111111111111',
      user_id: '00000000-0000-0000-0000-000000000001', // Admin user
      points: 5000,
      tier: 'gold'
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      user_id: '00000000-0000-0000-0000-000000000002', // Regular user
      points: 2450,
      tier: 'silver'
    }
  ]);

  // Add some points history for demonstration
  await knex('points_history').insert([
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      user_id: '00000000-0000-0000-0000-000000000001',
      points: 1000,
      action: 'order_completed',
      reference_id: '00000000-0000-0000-0000-000000000001',
      reference_type: 'order'
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      user_id: '00000000-0000-0000-0000-000000000001',
      points: 500,
      action: 'review_posted',
      reference_id: '00000000-0000-0000-0000-000000000001',
      reference_type: 'review'
    },
    {
      id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      user_id: '00000000-0000-0000-0000-000000000002',
      points: 800,
      action: 'order_completed',
      reference_id: '00000000-0000-0000-0000-000000000002',
      reference_type: 'order'
    },
    {
      id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      user_id: '00000000-0000-0000-0000-000000000002',
      points: 50,
      action: 'review_posted',
      reference_id: '00000000-0000-0000-0000-000000000002',
      reference_type: 'review'
    }
  ]);
};

