import { getAllReservations, getReservationById, createReservation, updateReservation, deleteReservation, getReservationsByUser, getReservationsByRestaurant } from '../models/reservationModel.js';

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
    const [reservation] = await createReservation(req.body);
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
    await deleteReservation(req.params.id);
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
