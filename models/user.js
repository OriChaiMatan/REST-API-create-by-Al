// User model (without classes)
import { db } from '../database/db.js';
import bcrypt from 'bcryptjs';

/**
 * Creates a new user object
 * @param {string} email - User's email address
 * @param {string} password - User's password (will be hashed)
 * @param {string} name - User's name (optional)
 * @returns {Object} User object
 */
export function createUser(email, password, name = '') {
  return {
    email,
    password, // Password will be hashed in insertUser
    name,
    createdAt: new Date().toISOString()
  };
}

/**
 * Insert a new user into the database
 * @param {string} email - User's email address
 * @param {string} password - User's password (will be hashed)
 * @param {string} name - User's name (optional)
 * @returns {Object} Created user object with id
 */
export function insertUser(email, password, name = '') {
  // Hash the password before storing
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  const user = createUser(email, hashedPassword, name);
  
  const stmt = db.prepare(`
    INSERT INTO users (email, password, name, createdAt)
    VALUES (?, ?, ?, ?)
  `);
  
  const result = stmt.run(user.email, user.password, user.name, user.createdAt);
  
  return {
    id: result.lastInsertRowid,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt
  };
}

/**
 * Find a user by email
 * @param {string} email - User's email address
 * @returns {Object|null} User object or null if not found
 */
export function findUserByEmail(email) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email) || null;
}

/**
 * Find a user by ID
 * @param {number} id - User's ID
 * @returns {Object|null} User object or null if not found
 */
export function findUserById(id) {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id) || null;
}

/**
 * Get all users (for admin purposes)
 * @returns {Array} Array of user objects
 */
export function getAllUsers() {
  const stmt = db.prepare('SELECT id, email, name, createdAt FROM users');
  return stmt.all();
}

/**
 * Update user information
 * @param {number} id - User's ID
 * @param {Object} updates - Object with fields to update (email, name, password)
 * @returns {Object|null} Updated user object or null if not found
 */
export function updateUser(id, updates) {
  const allowedFields = ['email', 'name', 'password'];
  const fields = [];
  const values = [];
  
  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key) && value !== undefined) {
      // Hash password if it's being updated
      const processedValue = key === 'password' ? bcrypt.hashSync(value, 10) : value;
      fields.push(`${key} = ?`);
      values.push(processedValue);
    }
  }
  
  if (fields.length === 0) {
    return findUserById(id);
  }
  
  values.push(id);
  const stmt = db.prepare(`
    UPDATE users 
    SET ${fields.join(', ')} 
    WHERE id = ?
  `);
  
  const result = stmt.run(...values);
  
  if (result.changes === 0) {
    return null;
  }
  
  return findUserById(id);
}

/**
 * Compare a plain text password with a hashed password
 * @param {string} plainPassword - Plain text password to compare
 * @param {string} hashedPassword - Hashed password from database
 * @returns {boolean} True if passwords match
 */
export function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}

/**
 * Delete a user by ID
 * @param {number} id - User's ID
 * @returns {boolean} True if user was deleted, false if not found
 */
export function deleteUser(id) {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

/**
 * Validates user email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates user password (basic validation)
 * @param {string} password - Password to validate
 * @returns {boolean} True if password meets minimum requirements
 */
export function validatePassword(password) {
  return password && password.length >= 6;
}

/**
 * Validates user data before creating user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} Validation result with isValid and errors
 */
export function validateUserData(email, password) {
  const errors = [];

  if (!email || !email.trim()) {
    errors.push('Email is required');
  } else if (!validateEmail(email)) {
    errors.push('Invalid email format');
  }

  if (!password || !password.trim()) {
    errors.push('Password is required');
  } else if (!validatePassword(password)) {
    errors.push('Password must be at least 6 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

