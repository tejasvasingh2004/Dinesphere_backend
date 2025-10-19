
import { v4 as uuidv4 } from 'uuid';
import db from '../models/db.js';

/**
 * Get all restaurants with filtering, sorting, and pagination
 */
export const getRestaurants = async (req, res, next) => {
  try {
    const { 
      cuisine, 
      price_min, 
      price_max, 
      location, 
      sort_by, 
      search,
      page = 1, 
      limit = 20,
      rating_min
    } = req.query;

    let query = db('restaurants')
      .leftJoin('users', 'restaurants.owner_id', 'users.id')
      .select(
        'restaurants.*',
        'users.full_name as owner_name',
        'users.email as owner_email'
      );

    // Search functionality
    if (search) {
      query = query.where(function() {
        this.where('restaurants.name', 'ilike', `%${search}%`)
            .orWhere('restaurants.description', 'ilike', `%${search}%`)
            .orWhere('restaurants.cuisine', 'ilike', `%${search}%`)
            .orWhere('restaurants.location', 'ilike', `%${search}%`);
      });
    }

    // Filter by cuisine
    if (cuisine && cuisine !== 'all') {
      query = query.where('restaurants.cuisine', 'ilike', `%${cuisine}%`);
    }

    // Filter by location
    if (location) {
      query = query.where('restaurants.location', 'ilike', `%${location}%`);
    }

    // Filter by price range
    if (price_min) {
      query = query.whereRaw("substring(restaurants.price_range from '₹([0-9]+)')::int >= ?", [price_min]);
    }
    if (price_max) {
      query = query.whereRaw("substring(restaurants.price_range from '-₹([0-9]+)')::int <= ?", [price_max]);
    }

    // Filter by minimum rating
    if (rating_min) {
      query = query.where('restaurants.rating', '>=', rating_min);
    }

    // Sorting
    if (sort_by) {
      switch (sort_by) {
        case 'rating':
          query = query.orderBy('restaurants.rating', 'desc');
          break;
        case 'price_low':
          query = query.orderByRaw("substring(restaurants.price_range from '₹([0-9]+)')::int asc");
          break;
        case 'price_high':
          query = query.orderByRaw("substring(restaurants.price_range from '-₹([0-9]+)')::int desc");
          break;
        case 'name':
          query = query.orderBy('restaurants.name', 'asc');
          break;
        case 'newest':
          query = query.orderBy('restaurants.created_at', 'desc');
          break;
        default:
          query = query.orderBy('restaurants.created_at', 'desc');
      }
    } else {
      query = query.orderBy('restaurants.created_at', 'desc');
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query.limit(parseInt(limit)).offset(offset);

    const restaurants = await query;

    // Get total count for pagination
    let countQuery = db('restaurants');
    
    if (search) {
      countQuery = countQuery.where(function() {
        this.where('name', 'ilike', `%${search}%`)
            .orWhere('description', 'ilike', `%${search}%`)
            .orWhere('cuisine', 'ilike', `%${search}%`)
            .orWhere('location', 'ilike', `%${search}%`);
      });
    }
    if (cuisine && cuisine !== 'all') {
      countQuery = countQuery.where('cuisine', 'ilike', `%${cuisine}%`);
    }
    if (location) {
      countQuery = countQuery.where('location', 'ilike', `%${location}%`);
    }
    if (price_min) {
      countQuery = countQuery.whereRaw("substring(price_range from '₹([0-9]+)')::int >= ?", [price_min]);
    }
    if (price_max) {
      countQuery = countQuery.whereRaw("substring(price_range from '-₹([0-9]+)')::int <= ?", [price_max]);
    }
    if (rating_min) {
      countQuery = countQuery.where('rating', '>=', rating_min);
    }

    const [{ count }] = await countQuery.count('* as count');

    res.json({ 
      success: true, 
      data: restaurants, 
      message: 'Restaurants fetched successfully',
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(count),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching restaurants:', err);
    next(err);
  }
};

/**
 * Get a single restaurant by ID with additional details
 */
export const getRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Restaurant ID is required' 
      });
    }

    const restaurant = await db('restaurants')
      .leftJoin('users', 'restaurants.owner_id', 'users.id')
      .select(
        'restaurants.*',
        'users.full_name as owner_name',
        'users.email as owner_email',
        'users.phone as owner_phone'
      )
      .where('restaurants.id', id)
      .first();

    if (!restaurant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Restaurant not found' 
      });
    }

    // Get restaurant reviews count and average rating
    const reviewStats = await db('reviews')
      .where('restaurant_id', id)
      .select(
        db.raw('COUNT(*) as review_count'),
        db.raw('AVG(rating) as average_rating')
      )
      .first();

    // Get menu categories count
    const menuStats = await db('menu_categories')
      .where('restaurant_id', id)
      .count('* as category_count')
      .first();

    const restaurantData = {
      ...restaurant,
      review_count: parseInt(reviewStats.review_count) || 0,
      average_rating: parseFloat(reviewStats.average_rating) || 0,
      menu_categories_count: parseInt(menuStats.category_count) || 0
    };

    res.json({ 
      success: true, 
      data: restaurantData, 
      message: 'Restaurant fetched successfully' 
    });
  } catch (err) {
    console.error('Error fetching restaurant:', err);
    next(err);
  }
};

/**
 * Create a new restaurant
 */
export const create = async (req, res, next) => {
  try {
    const { 
      owner_id, 
      name, 
      description, 
      website, 
      cuisine, 
      price_range, 
      location, 
      open_time, 
      available_slots,
      image 
    } = req.body;

    // Validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Restaurant name is required' 
      });
    }

    if (name.length > 255) {
      return res.status(400).json({ 
        success: false, 
        message: 'Restaurant name must be less than 255 characters' 
      });
    }

    if (description && description.length > 1000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Description must be less than 1000 characters' 
      });
    }

    // Check if restaurant name already exists
    const existingRestaurant = await db('restaurants')
      .where('name', name.trim())
      .first();

    if (existingRestaurant) {
      return res.status(409).json({ 
        success: false, 
        message: 'A restaurant with this name already exists' 
      });
    }

    const restaurant = {
      id: uuidv4(),
      owner_id: owner_id || null,
      name: name.trim(),
      description: description?.trim() || null,
      website: website?.trim() || null,
      cuisine: cuisine?.trim() || null,
      price_range: price_range?.trim() || null,
      location: location?.trim() || null,
      open_time: open_time?.trim() || null,
      available_slots: parseInt(available_slots) || 0,
      image: image?.trim() || null,
      rating: 0,
      created_at: new Date(),
      updated_at: new Date()
    };

    const [createdRestaurant] = await db('restaurants')
      .insert(restaurant)
      .returning('*');

    res.status(201).json({ 
      success: true, 
      data: createdRestaurant, 
      message: 'Restaurant created successfully' 
    });
  } catch (err) {
    console.error('Error creating restaurant:', err);
    next(err);
  }
};

/**
 * Update a restaurant
 */
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updated_at: new Date() };

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Restaurant ID is required' 
      });
    }

    // Check if restaurant exists
    const existingRestaurant = await db('restaurants')
      .where('id', id)
      .first();

    if (!existingRestaurant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Restaurant not found' 
      });
    }

    // Validation
    if (updates.name && updates.name.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Restaurant name cannot be empty' 
      });
    }

    if (updates.name && updates.name.length > 255) {
      return res.status(400).json({ 
        success: false, 
        message: 'Restaurant name must be less than 255 characters' 
      });
    }

    if (updates.description && updates.description.length > 1000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Description must be less than 1000 characters' 
      });
    }

    // Check if new name conflicts with existing restaurant
    if (updates.name && updates.name !== existingRestaurant.name) {
      const nameConflict = await db('restaurants')
        .where('name', updates.name.trim())
        .where('id', '!=', id)
        .first();

      if (nameConflict) {
        return res.status(409).json({ 
          success: false, 
          message: 'A restaurant with this name already exists' 
        });
      }
    }

    // Clean up the updates object
    const allowedFields = [
      'name', 'description', 'website', 'cuisine', 'price_range', 
      'location', 'open_time', 'available_slots', 'image'
    ];
    
    const cleanedUpdates = {};
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        if (typeof updates[field] === 'string') {
          cleanedUpdates[field] = updates[field].trim() || null;
        } else {
          cleanedUpdates[field] = updates[field];
        }
      }
    });

    const [updatedRestaurant] = await db('restaurants')
      .where('id', id)
      .update(cleanedUpdates)
      .returning('*');

    res.json({ 
      success: true, 
      data: updatedRestaurant, 
      message: 'Restaurant updated successfully' 
    });
  } catch (err) {
    console.error('Error updating restaurant:', err);
    next(err);
  }
};

/**
 * Delete a restaurant
 */
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Restaurant ID is required' 
      });
    }

    // Check if restaurant exists
    const existingRestaurant = await db('restaurants')
      .where('id', id)
      .first();

    if (!existingRestaurant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Restaurant not found' 
      });
    }

    // Check if restaurant has active reservations
    const activeReservations = await db('reservations')
      .where('restaurant_id', id)
      .whereIn('status', ['pending', 'confirmed'])
      .count('* as count')
      .first();

    if (parseInt(activeReservations.count) > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'Cannot delete restaurant with active reservations' 
      });
    }

    // Delete related data first (due to foreign key constraints)
    await db('menu_items').where('restaurant_id', id).del();
    await db('menu_categories').where('restaurant_id', id).del();
    await db('reviews').where('restaurant_id', id).del();
    await db('images').where('entity_type', 'restaurant').where('entity_id', id).del();
    
    // Delete the restaurant
    await db('restaurants').where('id', id).del();

    res.json({ 
      success: true, 
      message: 'Restaurant deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting restaurant:', err);
    next(err);
  }
};

/**
 * Get restaurants by owner
 */
export const getRestaurantsByOwner = async (req, res, next) => {
  try {
    const { owner_id } = req.params;

    if (!owner_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Owner ID is required' 
      });
    }

    const restaurants = await db('restaurants')
      .where('owner_id', owner_id)
      .select('*')
      .orderBy('created_at', 'desc');

    res.json({ 
      success: true, 
      data: restaurants, 
      message: 'Owner restaurants fetched successfully' 
    });
  } catch (err) {
    console.error('Error fetching owner restaurants:', err);
    next(err);
  }
};

/**
 * Update restaurant rating (called when reviews are added/updated)
 */
export const updateRating = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Restaurant ID is required' 
      });
    }

    // Calculate new average rating
    const ratingStats = await db('reviews')
      .where('restaurant_id', id)
      .select(
        db.raw('AVG(rating) as average_rating'),
        db.raw('COUNT(*) as review_count')
      )
      .first();

    const newRating = parseFloat(ratingStats.average_rating) || 0;

    await db('restaurants')
      .where('id', id)
      .update({ 
        rating: newRating,
        updated_at: new Date()
      });

    res.json({ 
      success: true, 
      data: { rating: newRating, review_count: parseInt(ratingStats.review_count) },
      message: 'Restaurant rating updated successfully' 
    });
  } catch (err) {
    console.error('Error updating restaurant rating:', err);
    next(err);
  }
};
