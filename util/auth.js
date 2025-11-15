import jwt from 'jsonwebtoken';

// JWT secret key from environment variable (fallback to default for development)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'; // Default: 7 days

/**
 * Generate a JWT token for a user
 * @param {number} userId - User's ID
 * @param {string} email - User's email address
 * @returns {string} JWT token
 */
export function generateToken(userId, email) {
  const payload = {
    id: userId,
    email: email
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded token payload (with id and email) or null if invalid
 */
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    // Token is invalid, expired, or malformed
    return null;
  }
}

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value (format: "Bearer <token>")
 * @returns {string|null} Token string or null if not found/invalid format
 */
export function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove "Bearer " prefix
}

