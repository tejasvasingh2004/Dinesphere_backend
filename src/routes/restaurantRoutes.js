import express from 'express';
import { getRestaurants, getRestaurant, create, update, remove } from '../controllers/restaurantController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getRestaurants);
router.get('/:id', getRestaurant);
router.post('/', authenticate, authorize(1), create); // admin only
router.put('/:id', authenticate, authorize(1), update); // admin only
router.delete('/:id', authenticate, authorize(1), remove); // admin only

export default router;
