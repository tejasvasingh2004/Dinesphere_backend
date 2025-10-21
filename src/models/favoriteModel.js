import db from './db.js';

export const getUserFavorites = async (userId) => {
  return await db('user_favorites')
    .select(
      'user_favorites.*',
      'restaurants.name as restaurant_name',
      'restaurants.description',
      'restaurants.cuisine',
      'restaurants.rating',
      'restaurants.price_range',
      'restaurants.location',
      'restaurants.image',
      'restaurants.open_time'
    )
    .leftJoin('restaurants', 'user_favorites.restaurant_id', 'restaurants.id')
    .where('user_favorites.user_id', userId)
    .orderBy('user_favorites.created_at', 'desc');
};

export const addFavorite = async (userId, restaurantId) => {
  try {
    const [favorite] = await db('user_favorites')
      .insert({
        user_id: userId,
        restaurant_id: restaurantId
      })
      .returning('*');
    return favorite;
  } catch (err) {
    // Handle duplicate key error (already favorited)
    if (err.code === '23505') {
      return { message: 'Restaurant already in favorites' };
    }
    throw err;
  }
};

export const removeFavorite = async (userId, restaurantId) => {
  return await db('user_favorites')
    .where('user_id', userId)
    .where('restaurant_id', restaurantId)
    .del();
};

export const isFavorite = async (userId, restaurantId) => {
  const favorite = await db('user_favorites')
    .where('user_id', userId)
    .where('restaurant_id', restaurantId)
    .first();
  
  return !!favorite;
};

export const getFavoriteCount = async (restaurantId) => {
  const result = await db('user_favorites')
    .where('restaurant_id', restaurantId)
    .count('* as count')
    .first();
  
  return parseInt(result.count);
};

