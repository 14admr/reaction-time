const { Pool } = require('pg');
require('dotenv').config();

async function testDatabaseConnection() {
  console.log('🧪 Testing Supabase PostgreSQL connection...');
  console.log('📍 Database URL:', process.env.DATABASE_URL ? 'Set ✅' : 'Not set ❌');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in .env file');
    return;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Test connection
    console.log('🔄 Connecting to database...');
    const client = await pool.connect();
    console.log('✅ Successfully connected to Supabase PostgreSQL!');

    // Test query
    const result = await client.query('SELECT NOW() as current_time, version() as db_version');
    console.log('🕐 Current time:', result.rows[0].current_time);
    console.log('🗄️ Database version:', result.rows[0].db_version.split(' ')[0]);

    // Test table creation
    console.log('🔄 Testing table creation...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        test_message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Test table created successfully');

    // Test insert
    await client.query(
      'INSERT INTO test_table (test_message) VALUES ($1)',
      ['Hello from Supabase!']
    );
    console.log('✅ Test data inserted successfully');

    // Test select
    const testResult = await client.query('SELECT * FROM test_table ORDER BY id DESC LIMIT 1');
    console.log('✅ Test data retrieved:', testResult.rows[0]);

    // Clean up test table
    await client.query('DROP TABLE IF EXISTS test_table');
    console.log('🧹 Test table cleaned up');

    client.release();
    console.log('🎉 All database tests passed! Supabase is ready to use.');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('🔍 Full error:', error);
  } finally {
    await pool.end();
  }
}

testDatabaseConnection();
