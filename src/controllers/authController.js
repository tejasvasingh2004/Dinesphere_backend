import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/db.js';
import { v4 as uuidv4 } from 'uuid';
const JWT_SECRET = process.env.JWT_SECRET || 'dinesphere_jwt_secret_key_2024';

// Updated register function to ensure role exists before user insertion
export const register = async (req, res, next) => {
  try {
    const { email, password, full_name, phone, role_id, is_active = true } = req.body;
    if (!email || !password || !role_id) {
      return res.status(400).json({ success: false, message: 'Email, password, and role_id are required.' });
    }

    // Check if role exists
    const existingRole = await db('roles').where({ id: role_id }).first();
    if (!existingRole) {
      // Insert role with default name based on role_id
      let roleName = 'user';
      if (role_id === 1) roleName = 'admin';
      await db('roles').insert({ id: role_id, name: roleName });
    }

    // Check if user already exists
    const existing = await db('users').where({ email }).first();
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      email,
      password_hash,
      full_name,
      phone,
      role_id,
      is_active
    };
    await db('users').insert(user);
    res.status(201).json({ success: true, message: 'User registered successfully.' });
  } catch (err) {
    next(err);
  }
};

// Register restaurant function including owner user creation
export const registerRestaurant = async (req, res, next) => {
  try {
    const { restaurantName, ownerName, email, password, confirmPassword, phone, address, cuisine, description, hours } = req.body;

    // Validate required fields
    if (!restaurantName || !ownerName || !email || !password || !confirmPassword || !phone || !address || !cuisine || !hours) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    // Check if user already exists
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // Check if restaurant with the same name already exists
    const existingRestaurant = await db('restaurants').where({ name: restaurantName }).first();
    if (existingRestaurant) {
      return res.status(400).json({ success: false, message: 'Restaurant with this name already exists.' });
    }

    // Check if role for restaurant owner exists (role_id 3 for restaurant owner)
    const roleId = 3;
    const existingRole = await db('roles').where({ id: roleId }).first();
    if (!existingRole) {
      await db('roles').insert({ id: roleId, name: 'restaurant_owner' });
    }

    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    // Create owner user
    const ownerId = uuidv4();
    const user = {
      id: ownerId,
      email,
      password_hash,
      full_name: ownerName,
      phone,
      role_id: roleId,
      is_active: true
    };
    await db('users').insert(user);

    // Create restaurant object
    const restaurant = {
      id: uuidv4(),
      owner_id: ownerId,
      name: restaurantName,
      description,
      cuisine,
      location: address,
      open_time: hours
    };

    // Insert restaurant into database
    await db('restaurants').insert(restaurant);

    res.status(201).json({
      success: true,
      message: 'Restaurant and owner registered successfully.',
      data: { user, restaurant }
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role_id },
      process.env.JWT_SECRET || 'dinesphere_jwt_secret_key_2024',
      { expiresIn: '1h' }
    );
    res.status(200).json({ 
      success: true, 
      message: 'User logged in successfully.', 
      token,
      user: { id: user.id, email: user.email, full_name: user.full_name, role_id: user.role_id }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Login function for restaurant owners
export const loginRestaurant = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    // Check if user is a restaurant owner (role_id 3)
    if (user.role_id !== 3) {
      return res.status(401).json({ success: false, message: 'Access denied. Not a restaurant owner.' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role_id },
      process.env.JWT_SECRET || 'dinesphere_jwt_secret_key_2024',
      { expiresIn: '1h' }
    );
    // Fetch restaurant details
    const restaurant = await db('restaurants').where({ owner_id: user.id }).first();
    res.status(200).json({
      success: true,
      message: 'Restaurant owner logged in successfully.',
      token,
      user: { id: user.id, email: user.email, full_name: user.full_name, role_id: user.role_id },
      restaurant: restaurant ? { id: restaurant.id, name: restaurant.name } : null
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

