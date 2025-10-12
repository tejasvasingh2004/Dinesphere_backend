export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('menu_categories').del();

  // Inserts seed entries
  await knex('menu_categories').insert([
    {
      id: 1,
      restaurant_id: '11111111-1111-1111-1111-111111111111',
      name: 'Appetizers',
      position: 1
    },
    {
      id: 2,
      restaurant_id: '11111111-1111-1111-1111-111111111111',
      name: 'Main Course',
      position: 2
    },
    {
      id: 3,
      restaurant_id: '11111111-1111-1111-1111-111111111111',
      name: 'Desserts',
      position: 3
    },
    {
      id: 4,
      restaurant_id: '22222222-2222-2222-2222-222222222222',
      name: 'Starters',
      position: 1
    },
    {
      id: 5,
      restaurant_id: '22222222-2222-2222-2222-222222222222',
      name: 'Curry Dishes',
      position: 2
    },
    {
      id: 6,
      restaurant_id: '33333333-3333-3333-3333-333333333333',
      name: 'Seafood Specials',
      position: 1
    }
  ]);
};
