import knex from 'knex';
import knexConfig from './knexfile.js';

const db = knex(knexConfig.development);

async function testConnection() {
  try {
    console.log('Testing database connection...');
    await db.raw('SELECT 1');
    console.log('✅ Database connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 To fix this issue:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Update the password in knexfile.js to remove special characters');
    console.log('3. Create the database: createdb dinesphere_dev');
    console.log('4. Run: npx knex migrate:latest');
    process.exit(1);
  }
}

testConnection();
