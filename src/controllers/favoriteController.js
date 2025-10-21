import {
  getUserFavorites,
  addFavorite as addFavoriteModel,
  removeFavorite as removeFavoriteModel,
  isFavorite,
  getFavoriteCount
} from '../models/favoriteModel.js';
import db from '../models/db.js';

export const getFavorites = async (req, res, next) => {
  try {
    const favorites = await getUserFavorites(req.user.id);
    res.json({ success: true, data: favorites, message: 'Favorites fetched' });
  } catch (err) {
    next(err);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    const { restaurant_id } = req.params;
    
    // Validate restaurant exists
    const restaurant = await db('restaurants')
      .where('id', restaurant_id)
      .first();
    
    if (!restaurant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Restaurant not found' 
      });
    }

    const result = await addFavoriteModel(req.user.id, restaurant_id);
    
    if (result.message) {
      // Already favorited
      return res.json({ success: true, message: result.message });
    }
    
    res.status(201).json({ success: true, data: result, message: 'Restaurant added to favorites' });
  } catch (err) {
    next(err);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const { restaurant_id } = req.params;
    const deleted = await removeFavoriteModel(req.user.id, restaurant_id);
    
    if (deleted === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Restaurant not found in favorites' 
      });
    }
    
    res.json({ success: true, message: 'Restaurant removed from favorites' });
  } catch (err) {
    next(err);
  }
};

export const checkFavorite = async (req, res, next) => {
  try {
    const { restaurant_id } = req.params;
    const favorited = await isFavorite(req.user.id, restaurant_id);
    
    res.json({ 
      success: true, 
      data: { is_favorite: favorited }, 
      message: 'Favorite status checked' 
    });
  } catch (err) {
    next(err);
  }
};
