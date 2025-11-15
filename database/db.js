import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database connection
const dbPath = path.join(__dirname, '..', 'database.sqlite');
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

/**
 * Initialize the database with required tables
 */
export function initDatabase() {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT DEFAULT '',
      createdAt TEXT NOT NULL
    )
  `);

  // Create index on email for faster lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
  `);

  console.log('Database initialized successfully');
}

/**
 * Close the database connection
 */
export function closeDatabase() {
  db.close();
  console.log('Database connection closed');
}

