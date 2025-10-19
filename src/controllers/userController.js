import { getUserById, updateUser } from '../models/userModel.js';
import { getOrdersByUser } from '../models/orderModel.js';
import { getReservationsByUser } from '../models/reservationModel.js';
import { getUserLoyaltyPoints } from '../models/loyaltyModel.js';
import { getUserFavorites } from '../models/favoriteModel.js';
import db from '../models/db.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user, message: 'Profile fetched' });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const [user] = await updateUser(req.user.id, updates);
    res.json({ success: true, data: user, message: 'Profile updated' });
  } catch (err) {
    next(err);
  }
};

export const getOrderHistory = async (req, res, next) => {
  try {
    const orders = await getOrdersByUser(req.user.id);
    res.json({ success: true, data: orders, message: 'Order history fetched' });
  } catch (err) {
    next(err);
  }
};

export const getReservationHistory = async (req, res, next) => {
  try {
    const reservations = await getReservationsByUser(req.user.id);
    res.json({ success: true, data: reservations, message: 'Reservation history fetched' });
  } catch (err) {
    next(err);
  }
};

export const getStatistics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get order statistics
    const orderStats = await db('orders')
      .where('user_id', userId)
      .select(
        db.raw('COUNT(*) as total_orders'),
        db.raw('SUM(total_amount) as total_spent'),
        db.raw('AVG(total_amount) as average_order_value')
      )
      .first();

    // Get reservation statistics
    const reservationStats = await db('reservations')
      .where('user_id', userId)
      .select(db.raw('COUNT(*) as total_reservations'))
      .first();

    // Get loyalty points
    const loyaltyAccount = await getUserLoyaltyPoints(userId);
    const loyaltyPoints = loyaltyAccount ? loyaltyAccount.points : 0;
    const tier = loyaltyAccount ? loyaltyAccount.tier : 'bronze';

    // Get favorites count
    const favoritesCount = await db('user_favorites')
      .where('user_id', userId)
      .count('* as count')
      .first();

    // Get reviews count
    const reviewsCount = await db('reviews')
      .where('user_id', userId)
      .count('* as count')
      .first();

    const statistics = {
      orders: {
        total_orders: parseInt(orderStats.total_orders) || 0,
        total_spent: parseFloat(orderStats.total_spent) || 0,
        average_order_value: parseFloat(orderStats.average_order_value) || 0
      },
      reservations: {
        total_reservations: parseInt(reservationStats.total_reservations) || 0
      },
      loyalty: {
        points: loyaltyPoints,
        tier: tier
      },
      favorites: {
        total_favorites: parseInt(favoritesCount.count) || 0
      },
      reviews: {
        total_reviews: parseInt(reviewsCount.count) || 0
      }
    };

    res.json({ success: true, data: statistics, message: 'User statistics fetched' });
  } catch (err) {
    next(err);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    const allowedFields = [
      'dietary_preferences',
      'address',
      'bio',
      'avatar_url'
    ];
    
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No valid preference fields provided' 
      });
    }
    
    const [user] = await updateUser(req.user.id, updateData);
    res.json({ success: true, data: user, message: 'Preferences updated' });
  } catch (err) {
    next(err);
  }
};
