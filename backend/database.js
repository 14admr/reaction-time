const { Pool } = require('pg');
require('dotenv').config();

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
  process.exit(-1);
});

// Test connection on startup
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    return false;
  }
}

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create participants table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS participants (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create game_sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS game_sessions (
        id SERIAL PRIMARY KEY,
        participant_id INTEGER REFERENCES participants(id) ON DELETE CASCADE,
        game_type VARCHAR(10) NOT NULL,
        total_iterations INTEGER NOT NULL,
        correct_answers INTEGER NOT NULL,
        average_reaction_time FLOAT NOT NULL,
        accuracy_percentage INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create trials table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trials (
        id SERIAL PRIMARY KEY,
        session_id INTEGER REFERENCES game_sessions(id) ON DELETE CASCADE,
        iteration_number INTEGER NOT NULL,
        number_shown INTEGER NOT NULL,
        color_shown VARCHAR(20) NOT NULL,
        key_pressed VARCHAR(10) NOT NULL,
        reaction_time INTEGER NOT NULL,
        is_correct BOOLEAN NOT NULL
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}

// Database helper functions
const db = {
  // Create or get participant
  async createParticipant(email) {
    try {
      const result = await pool.query(
        'INSERT INTO participants (email) VALUES ($1) ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email RETURNING id',
        [email]
      );
      return result.rows[0].id;
    } catch (error) {
      console.error('Error creating participant:', error);
      throw error;
    }
  },

  // Create game session
  async createGameSession(participantId, gameData) {
    try {
      const { gameType, iterations, results } = gameData;
      
      const result = await pool.query(
        `INSERT INTO game_sessions 
         (participant_id, game_type, total_iterations, correct_answers, average_reaction_time, accuracy_percentage)
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id`,
        [
          participantId,
          gameType,
          iterations,
          results.correctAnswers,
          results.averageReactionTime,
          results.accuracy
        ]
      );
      
      return result.rows[0].id;
    } catch (error) {
      console.error('Error creating game session:', error);
      throw error;
    }
  },

  // Create trials
  async createTrials(sessionId, trials) {
    try {
      if (!trials || !Array.isArray(trials) || trials.length === 0) {
        return;
      }

      const values = trials.map(trial => [
        sessionId,
        trial.iteration,
        trial.number,
        trial.color,
        trial.keyPressed,
        trial.reactionTime,
        trial.correct
      ]);

      const query = `
        INSERT INTO trials 
        (session_id, iteration_number, number_shown, color_shown, key_pressed, reaction_time, is_correct)
        VALUES ${trials.map((_, i) => 
          `($${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${i * 7 + 4}, $${i * 7 + 5}, $${i * 7 + 6}, $${i * 7 + 7})`
        ).join(', ')}
      `;

      await pool.query(query, values.flat());
      console.log(`✅ Inserted ${trials.length} trials for session ${sessionId}`);
    } catch (error) {
      console.error('Error creating trials:', error);
      throw error;
    }
  },

  // Get all data for analysis (for researchers)
  async getAllData() {
    try {
      const result = await pool.query(`
        SELECT 
          p.email,
          p.created_at as participant_created,
          gs.game_type,
          gs.total_iterations,
          gs.correct_answers,
          gs.average_reaction_time,
          gs.accuracy_percentage,
          gs.created_at as session_created,
          t.iteration_number,
          t.number_shown,
          t.color_shown,
          t.key_pressed,
          t.reaction_time,
          t.is_correct
        FROM participants p
        JOIN game_sessions gs ON p.id = gs.participant_id
        JOIN trials t ON gs.id = t.session_id
        ORDER BY gs.created_at DESC, t.iteration_number ASC
      `);
      return result.rows;
    } catch (error) {
      console.error('Error getting all data:', error);
      throw error;
    }
  }
};

module.exports = { pool, initializeDatabase, db, testConnection };
