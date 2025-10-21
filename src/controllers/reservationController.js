import { getAllReservations, getReservationById, createReservation, updateReservation, deleteReservation, getReservationsByUser, getReservationsByRestaurant, cancelReservation } from '../models/reservationModel.js';
import db from '../models/db.js';

export const getReservations = async (req, res, next) => {
  try {
    const reservations = await getAllReservations();
    res.json({ success: true, data: reservations, message: 'Reservations fetched' });
  } catch (err) {
    next(err);
  }
};

export const getReservation = async (req, res, next) => {
  try {
    const reservation = await getReservationById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    res.json({ success: true, data: reservation, message: 'Reservation fetched' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    // Validate required fields
    const { restaurant_id, user_id, party_size, reservation_start, reservation_end } = req.body;
    if (!restaurant_id || !user_id || !party_size || !reservation_start) {
      return res.status(400).json({ success: false, message: 'Missing required reservation fields' });
    }

    // Check if restaurant has available slots
    const restaurant = await db('restaurants').where('id', restaurant_id).select('available_slots').first();
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    if (restaurant.available_slots <= 0) {
      return res.status(409).json({ success: false, message: 'No available slots for this restaurant' });
    }

    const reservationData = {
      restaurant_id,
      user_id,
      party_size,
      reservation_start,
      reservation_end,
      special_requests: req.body.special_requests || null
    };

    const [reservation] = await createReservation(reservationData);

    // Decrement available slots in restaurants table
    await db('restaurants')
      .where('id', restaurant_id)
      .decrement('available_slots', 1);

    res.status(201).json({ success: true, data: reservation, message: 'Reservation created' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const [reservation] = await updateReservation(req.params.id, req.body);
    res.json({ success: true, data: reservation, message: 'Reservation updated' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    // Get reservation details before deletion to restore slots
    const reservation = await getReservationById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    await deleteReservation(req.params.id);

    // Increment available slots in restaurants table
    await db('restaurants')
      .where('id', reservation.restaurant_id)
      .increment('available_slots', 1);

    res.json({ success: true, message: 'Reservation deleted' });
  } catch (err) {
    next(err);
  }
};

export const getReservationsByUserId = async (req, res, next) => {
  try {
    const reservations = await getReservationsByUser(req.params.user_id);
    res.json({ success: true, data: reservations, message: 'Reservations for user fetched' });
  } catch (err) {
    next(err);
  }
};

export const getReservationsByRestaurantId = async (req, res, next) => {
  try {
    const reservations = await getReservationsByRestaurant(req.params.restaurant_id);
    res.json({ success: true, data: reservations, message: 'Reservations for restaurant fetched' });
  } catch (err) {
    next(err);
  }
};

export const cancel = async (req, res, next) => {
  try {
    const reservation = await cancelReservation(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    res.json({ success: true, data: reservation, message: 'Reservation cancelled successfully' });
  } catch (err) {
    next(err);
  }
};
