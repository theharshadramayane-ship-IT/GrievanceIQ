const { Pool } = require('pg');

// Yahan aapka Neon Connection String hai
const connectionString = "postgresql://neondb_owner:npg_78BEfgDbGcCw@ep-cool-morning-b33fd67t-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false } // Neon cloud database ke liye zaroori hai
});

// Database Table create karne ka function
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS complaints (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        department VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Pending',
        sla_time VARCHAR(50) DEFAULT '24h 00m',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Database table created successfully!");
  } catch (err) {
    console.error("Error creating table:", err);
  }
};

initDB();

module.exports = pool;