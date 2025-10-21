export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('restaurants').del();

  // Inserts seed entries
  await knex('restaurants').insert([
    {
      id: '11111111-1111-1111-1111-111111111111',
      owner_id: '00000000-0000-0000-0000-000000000001',
      name: 'The Radison Square',
      description: 'Exquisite fine dining experience with world-class cuisine',
      website: 'https://theradisonsquare.com',
      cuisine: 'Fine Dining',
      rating: 4.8,
      price_range: '₹2500-10000',
      location: 'The Radison Chourah',
      image: '/radisonimage.jpg',
      open_time: '6:00 PM - 11:00 PM',
      available_slots: 12
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      owner_id: '00000000-0000-0000-0000-000000000001',
      name: 'Spice Garden',
      description: 'Authentic Indian flavors in a contemporary setting',
      website: 'https://spicegarden.com',
      cuisine: 'Indian',
      rating: 4.6,
      price_range: '₹800-2500',
      location: 'City Center',
      image: '/api/placeholder/300/200',
      open_time: '12:00 PM - 10:00 PM',
      available_slots: 8
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      owner_id: '00000000-0000-0000-0000-000000000001',
      name: 'Ocean Breeze',
      description: 'Fresh seafood with stunning ocean views',
      website: 'https://oceanbreeze.com',
      cuisine: 'Seafood',
      rating: 4.7,
      price_range: '₹1500-4000',
      location: 'Meghdoot District',
      image: '/api/placeholder/300/200',
      open_time: '5:00 PM - 12:00 AM',
      available_slots: 5
    }
  ]);
};
