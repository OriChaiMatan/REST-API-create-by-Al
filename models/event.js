// Event model
import { db } from '../database/db.js';

/**
 * Creates a new event object
 * @param {string} title - Event title
 * @param {string} description - Event description
 * @param {string} date - Event date (ISO string)
 * @param {string} location - Event location (optional)
 * @returns {Object} Event object
 */
export function createEvent(title, description, date, location = '') {
  return {
    title,
    description,
    date,
    location,
    createdAt: new Date().toISOString()
  };
}

/**
 * Insert a new event into the database
 * @param {string} title - Event title
 * @param {string} description - Event description
 * @param {string} date - Event date (ISO string)
 * @param {string} location - Event location (optional)
 * @returns {Object} Created event object with id
 */
export function insertEvent(title, description, date, location = '') {
  const event = createEvent(title, description, date, location);
  
  const stmt = db.prepare(`
    INSERT INTO events (title, description, date, location, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(event.title, event.description, event.date, event.location, event.createdAt);
  
  return {
    id: result.lastInsertRowid,
    ...event
  };
}

/**
 * Find an event by ID
 * @param {number} id - Event's ID
 * @returns {Object|null} Event object or null if not found
 */
export function findEventById(id) {
  const stmt = db.prepare('SELECT * FROM events WHERE id = ?');
  return stmt.get(id) || null;
}

/**
 * Get all events
 * @returns {Array} Array of event objects
 */
export function getAllEvents() {
  const stmt = db.prepare('SELECT * FROM events ORDER BY date ASC');
  return stmt.all();
}

/**
 * Update an event
 * @param {number} id - Event's ID
 * @param {Object} updates - Object with fields to update (title, description, date, location)
 * @returns {Object|null} Updated event object or null if not found
 */
export function updateEvent(id, updates) {
  const allowedFields = ['title', 'description', 'date', 'location'];
  const fields = [];
  const values = [];
  
  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key) && value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }
  
  if (fields.length === 0) {
    return findEventById(id);
  }
  
  values.push(id);
  const stmt = db.prepare(`
    UPDATE events 
    SET ${fields.join(', ')} 
    WHERE id = ?
  `);
  
  const result = stmt.run(...values);
  
  if (result.changes === 0) {
    return null;
  }
  
  return findEventById(id);
}

/**
 * Delete an event by ID
 * @param {number} id - Event's ID
 * @returns {boolean} True if event was deleted, false if not found
 */
export function deleteEvent(id) {
  const stmt = db.prepare('DELETE FROM events WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

