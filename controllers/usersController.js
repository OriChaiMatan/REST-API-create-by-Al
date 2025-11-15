import { insertUser, findUserByEmail, validateUserData } from '../models/user.js';

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

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create and insert new user into database
    const newUser = insertUser(email, password, name);

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

    // Find user in database
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password (plain text comparison)
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

