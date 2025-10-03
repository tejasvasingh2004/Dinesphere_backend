import express from 'express';
import { getReservations, getReservation, create, update, remove, getReservationsByUserId, getReservationsByRestaurantId } from '../controllers/reservationController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, getReservations);
router.get('/:id', authenticate, getReservation);
router.post('/', authenticate, authorize(3), create); // customer only
router.put('/:id', authenticate, authorize(3), update); // customer only
router.delete('/:id', authenticate, authorize(3), remove); // customer only
router.get('/user/:user_id', authenticate, getReservationsByUserId);
router.get('/restaurant/:restaurant_id', authenticate, getReservationsByRestaurantId);

export default router;
