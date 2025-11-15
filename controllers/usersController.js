import { createUser, validateUserData } from '../models/user.js';

// In-memory storage (temporary, until database is added)
// This will be replaced with database storage later
const users = [];

/**
 * Handle user signup
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function signup(req, res) {
  try {
    const { email, password, name } = req.body;

    // Validate user data
    const validation = validateUserData(email, password);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Check if user already exists (temporary check in memory)
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const newUser = createUser(email, password, name);
    
    // Store user (temporary, in memory)
    users.push(newUser);

    // Return success response (without password)
    const { password: _, ...userResponse } = newUser;
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
}

/**
 * Handle user login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user (temporary check in memory)
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password (temporary, plain text comparison)
    // In production, this should compare hashed passwords
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Return success response (without password)
    const { password: _, ...userResponse } = user;
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
}

