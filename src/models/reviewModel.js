import db from './db.js';

export const getAllReviews = async () => {
  return await db('reviews')
    .select(
      'reviews.*',
      'users.full_name as user_name',
      'restaurants.name as restaurant_name'
    )
    .leftJoin('users', 'reviews.user_id', 'users.id')
    .leftJoin('restaurants', 'reviews.restaurant_id', 'restaurants.id')
    .orderBy('reviews.created_at', 'desc');
};

export const getReviewById = async (id) => {
  return await db('reviews')
    .select(
      'reviews.*',
      'users.full_name as user_name',
      'users.email as user_email',
      'restaurants.name as restaurant_name'
    )
    .leftJoin('users', 'reviews.user_id', 'users.id')
    .leftJoin('restaurants', 'reviews.restaurant_id', 'restaurants.id')
    .where('reviews.id', id)
    .first();
};

export const createReview = async (reviewData) => {
  return await db('reviews').insert(reviewData).returning('*');
};

export const updateReview = async (id, reviewData) => {
  return await db('reviews').where({ id }).update(reviewData).returning('*');
};

export const deleteReview = async (id) => {
  return await db('reviews').where({ id }).del();
};

export const getReviewsByRestaurant = async (restaurantId, filters = {}) => {
  let query = db('reviews')
    .select(
      'reviews.*',
      'users.full_name as user_name',
      'users.email as user_email'
    )
    .leftJoin('users', 'reviews.user_id', 'users.id')
    .where('reviews.restaurant_id', restaurantId);

  // Apply filters
  if (filters.rating) {
    query = query.where('reviews.rating', filters.rating);
  }

  // Apply sorting
  if (filters.sort === 'rating') {
    query = query.orderBy('reviews.rating', 'desc');
  } else {
    query = query.orderBy('reviews.created_at', 'desc');
  }

  return await query;
};

export const getReviewsByUser = async (userId) => {
  return await db('reviews')
    .select(
      'reviews.*',
      'restaurants.name as restaurant_name',
      'restaurants.address as restaurant_address'
    )
    .leftJoin('restaurants', 'reviews.restaurant_id', 'restaurants.id')
    .where('reviews.user_id', userId)
    .orderBy('reviews.created_at', 'desc');
};

export const getRestaurantRatingStats = async (restaurantId) => {
  const stats = await db('reviews')
    .where('restaurant_id', restaurantId)
    .select(
      db.raw('AVG(rating) as average_rating'),
      db.raw('COUNT(*) as total_reviews'),
      db.raw('COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star'),
      db.raw('COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star'),
      db.raw('COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star'),
      db.raw('COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star'),
      db.raw('COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star')
    )
    .first();

  return {
    average_rating: parseFloat(stats.average_rating) || 0,
    total_reviews: parseInt(stats.total_reviews) || 0,
    rating_breakdown: {
      5: parseInt(stats.five_star) || 0,
      4: parseInt(stats.four_star) || 0,
      3: parseInt(stats.three_star) || 0,
      2: parseInt(stats.two_star) || 0,
      1: parseInt(stats.one_star) || 0
    }
  };
};

export const updateRestaurantRating = async (restaurantId) => {
  const stats = await getRestaurantRatingStats(restaurantId);
  
  await db('restaurants')
    .where('id', restaurantId)
    .update({
      rating: stats.average_rating,
      review_count: stats.total_reviews,
      updated_at: db.fn.now()
    });
};

