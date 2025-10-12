export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('menu_items').del();

  // Inserts seed entries
  await knex('menu_items').insert([
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      restaurant_id: '11111111-1111-1111-1111-111111111111',
      category_id: 1,
      name: 'Truffle Arancini',
      description: 'Crispy risotto balls with black truffle and parmesan',
      price: 850.00,
      currency: 'INR',
      is_available: true
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      restaurant_id: '11111111-1111-1111-1111-111111111111',
      category_id: 2,
      name: 'Wagyu Beef Tenderloin',
      description: 'Premium wagyu beef with seasonal vegetables',
      price: 4500.00,
      currency: 'INR',
      is_available: true
    },
    {
      id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      restaurant_id: '11111111-1111-1111-1111-111111111111',
      category_id: 3,
      name: 'Chocolate Soufflé',
      description: 'Warm chocolate soufflé with vanilla ice cream',
      price: 650.00,
      currency: 'INR',
      is_available: true
    },
    {
      id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      restaurant_id: '22222222-2222-2222-2222-222222222222',
      category_id: 4,
      name: 'Paneer Tikka',
      description: 'Marinated cottage cheese skewers with spices',
      price: 350.00,
      currency: 'INR',
      is_available: true
    },
    {
      id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
      restaurant_id: '22222222-2222-2222-2222-222222222222',
      category_id: 5,
      name: 'Butter Chicken',
      description: 'Creamy tomato-based curry with tender chicken',
      price: 450.00,
      currency: 'INR',
      is_available: true
    },
    {
      id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
      restaurant_id: '33333333-3333-3333-3333-333333333333',
      category_id: 6,
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon with herbs and lemon',
      price: 1200.00,
      currency: 'INR',
      is_available: true
    }
  ]);
};
