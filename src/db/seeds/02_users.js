import bcrypt from 'bcrypt';

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  const passwordHash = await bcrypt.hash('password123', 10);

  // Inserts seed entries
  await knex('users').insert([
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@example.com',
      password_hash: passwordHash,
      full_name: 'Admin User',
      phone: '1234567890',
      role_id: 1,
      is_active: true
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'user@example.com',
      password_hash: passwordHash,
      full_name: 'Regular User',
      phone: '0987654321',
      role_id: 2,
      is_active: true
    }
  ]);
};
