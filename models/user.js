// User model (without classes)

/**
 * Creates a new user object
 * @param {string} email - User's email address
 * @param {string} password - User's password (will be hashed later)
 * @param {string} name - User's name (optional)
 * @returns {Object} User object
 */
export function createUser(email, password, name = '') {
  return {
    email,
    password, // In production, this should be hashed
    name,
    createdAt: new Date().toISOString()
  };
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

