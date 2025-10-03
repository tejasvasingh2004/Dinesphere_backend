import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/db.js';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

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

// export const register = async (req, res, next) => {
// -  try {
// -    const { email, password, full_name, phone, role_id, is_active = true } = req.body;
// -    if (!email || !password || !role_id) {
// -      return res.status(400).json({ success: false, message: 'Email, password, and role_id are required.' });
// -    }
// -
// -    // Check if role exists
// -    const existingRole = await db('roles').where({ id: role_id }).first();
// -    if (!existingRole) {
// -      // Insert role with default name based on role_id
// -      let roleName = 'user';
// -      if (role_id === 1) roleName = 'admin';
// -      await db('roles').insert({ id: role_id, name: roleName });
// -    }
// -
// -    // Check if user already exists
// -    const existing = await db('users').where({ email }).first();
// -    if (existing) {
// -      return res.status(400).json({ success: false, message: 'Email already registered.' });
// -    }
// -
// -    const password_hash = await bcrypt.hash(password, 10);
// -    const user = {
// -      id: uuidv4(),
// -      email,
// -      password_hash,
// -      full_name,
// -      phone,
// -      role_id,
// -      is_active
// -    };
// -    await db('users').insert(user);
// -    res.status(201).json({ success: true, message: 'User registered successfully.' });
// -  } catch (err) {
// -    next(err);
// -  }
// -};

// Register restaurant function following the same pattern as user registration
export const registerRestaurant = async (req, res, next) => {
  try {
    const { owner_id, name, description, website } = req.body;

    // Validate required fields
    if (!owner_id || !name) {
      return res.status(400).json({ success: false, message: 'Owner ID and restaurant name are required.' });
    }

    // Check if owner (user) exists
    const existingOwner = await db('users').where({ id: owner_id }).first();
    if (!existingOwner) {
      return res.status(400).json({ success: false, message: 'Owner (user) does not exist.' });
    }

    // Check if restaurant with the same name already exists
    const existingRestaurant = await db('restaurants').where({ name }).first();
    if (existingRestaurant) {
      return res.status(400).json({ success: false, message: 'Restaurant with this name already exists.' });
    }

    // Create restaurant object
    const restaurant = {
      id: uuidv4(),
      owner_id,
      name,
      description,
      website
    };

    // Insert restaurant into database
    await db('restaurants').insert(restaurant);

    res.status(201).json({
      success: true,
      message: 'Restaurant registered successfully.',
      data: restaurant
    });
  } catch (err) {
    next(err);
  }
};
