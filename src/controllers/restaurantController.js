
import { v4 as uuidv4 } from 'uuid';
import db from '../models/db.js';


export const getRestaurants = async (req, res, next) => {
  try {
    // Extract query params for filtering and sorting
    const { cuisine, price_min, price_max, location, sort_by } = req.query;

    let query = db('restaurants');

    if (cuisine) {
      query = query.where('cuisine', 'ilike', `%${cuisine}%`);
    }
    if (location) {
      query = query.where('location', 'ilike', `%${location}%`);
    }
    if (price_min) {
      query = query.whereRaw("substring(price_range from '₹([0-9]+)')::int >= ?", [price_min]);
    }
    if (price_max) {
      query = query.whereRaw("substring(price_range from '-₹([0-9]+)')::int <= ?", [price_max]);
    }

    if (sort_by) {
      if (sort_by === 'rating') {
        query = query.orderBy('rating', 'desc');
      } else if (sort_by === 'price_low') {
        query = query.orderByRaw("substring(price_range from '₹([0-9]+)')::int asc");
      } else if (sort_by === 'price_high') {
        query = query.orderByRaw("substring(price_range from '-₹([0-9]+)')::int desc");
      }
    }

    const restaurants = await query.select('*');
    res.json({ success: true, data: restaurants, message: 'Restaurants fetched' });
  } catch (err) {
    next(err);
  }
};


export const getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await db('restaurants').where({ id: req.params.id }).first();
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    res.json({ success: true, data: restaurant, message: 'Restaurant fetched' });
  } catch (err) {
    next(err);
  }
};


export const create = async (req, res, next) => {
  try {
    const { owner_id, name, description, website } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required.' });
    }
    const restaurant = {
      id: uuidv4(),
      owner_id: owner_id || null,
      name,
      description,
      website,
      created_at: new Date(),
      updated_at: new Date()
    };
    await db('restaurants').insert(restaurant);
    res.status(201).json({ success: true, data: restaurant, message: 'Restaurant created' });
  } catch (err) {
    next(err);
  }
};


export const update = async (req, res, next) => {
  try {
    const updates = { ...req.body, updated_at: new Date() };
    const [restaurant] = await db('restaurants').where({ id: req.params.id }).update(updates).returning('*');
    res.json({ success: true, data: restaurant, message: 'Restaurant updated' });
  } catch (err) {
    next(err);
  }
};


export const remove = async (req, res, next) => {
  try {
    await db('restaurants').where({ id: req.params.id }).del();
    res.json({ success: true, message: 'Restaurant deleted' });
  } catch (err) {
    next(err);
  }
};
