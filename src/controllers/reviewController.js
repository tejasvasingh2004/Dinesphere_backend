import { 
  getAllReviews, 
  getReviewById, 
  createReview, 
  updateReview, 
  deleteReview, 
  getReviewsByRestaurant, 
  getReviewsByUser, 
  getRestaurantRatingStats,
  updateRestaurantRating 
} from '../models/reviewModel.js';

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await getAllReviews();
    res.json({ success: true, data: reviews, message: 'Reviews fetched' });
  } catch (err) {
    next(err);
  }
};

export const getReview = async (req, res, next) => {
  try {
    const review = await getReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, data: review, message: 'Review fetched' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    // Validate required fields
    const { restaurant_id, user_id, rating, comment } = req.body;
    if (!restaurant_id || !user_id || !rating || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: restaurant_id, user_id, rating, comment' 
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be an integer between 1 and 5' 
      });
    }

    const reviewData = {
      restaurant_id,
      user_id,
      rating,
      comment,
      helpful_votes: 0
    };

    const [review] = await createReview(reviewData);
    
    // Update restaurant rating after creating review
    await updateRestaurantRating(restaurant_id);
    
    res.status(201).json({ success: true, data: review, message: 'Review created' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const review = await getReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if user can edit this review
    if (req.user.role_id !== 1 && req.user.id !== review.user_id) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only edit your own reviews' 
      });
    }

    // Validate rating if provided
    if (req.body.rating && (req.body.rating < 1 || req.body.rating > 5 || !Number.isInteger(req.body.rating))) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be an integer between 1 and 5' 
      });
    }

    const [updatedReview] = await updateReview(req.params.id, req.body);
    
    // Update restaurant rating after updating review
    await updateRestaurantRating(review.restaurant_id);
    
    res.json({ success: true, data: updatedReview, message: 'Review updated' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const review = await getReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if user can delete this review
    if (req.user.role_id !== 1 && req.user.id !== review.user_id) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only delete your own reviews' 
      });
    }

    await deleteReview(req.params.id);
    
    // Update restaurant rating after deleting review
    await updateRestaurantRating(review.restaurant_id);
    
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
};

export const getReviewsByRestaurantId = async (req, res, next) => {
  try {
    const filters = {
      rating: req.query.rating ? parseInt(req.query.rating) : null,
      sort: req.query.sort || 'date'
    };

    const reviews = await getReviewsByRestaurant(req.params.restaurant_id, filters);
    res.json({ success: true, data: reviews, message: 'Restaurant reviews fetched' });
  } catch (err) {
    next(err);
  }
};

export const getReviewsByUserId = async (req, res, next) => {
  try {
    const reviews = await getReviewsByUser(req.params.user_id);
    res.json({ success: true, data: reviews, message: 'User reviews fetched' });
  } catch (err) {
    next(err);
  }
};

export const getRestaurantStats = async (req, res, next) => {
  try {
    const stats = await getRestaurantRatingStats(req.params.restaurant_id);
    res.json({ success: true, data: stats, message: 'Restaurant rating stats fetched' });
  } catch (err) {
    next(err);
  }
};

