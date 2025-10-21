import db from './db.js';

export const getAllReservations = async () => {
  return await db('reservations').select('*');
};

export const getReservationById = async (id) => {
  return await db('reservations').where({ id }).first();
};

export const createReservation = async (reservationData) => {
  return await db('reservations').insert(reservationData).returning('*');
};

export const updateReservation = async (id, reservationData) => {
  return await db('reservations').where({ id }).update(reservationData).returning('*');
};

export const deleteReservation = async (id) => {
  return await db('reservations').where({ id }).del();
};

export const getReservationsByUser = async (userId) => {
  return await db('reservations').where({ user_id: userId });
};

export const getReservationsByRestaurant = async (restaurantId) => {
  return await db('reservations').where({ restaurant_id: restaurantId });
};

export const cancelReservation = async (id) => {
  // First get the reservation to restore slots
  const reservation = await db('reservations').where({ id }).first();
  if (!reservation) {
    return null;
  }

  // Update status to cancelled
  const [updatedReservation] = await db('reservations')
    .where({ id })
    .update({ status: 'cancelled', updated_at: db.fn.now() })
    .returning('*');

  // Restore available slots in restaurants table
  await db('restaurants')
    .where('id', reservation.restaurant_id)
    .increment('available_slots', 1);

  return updatedReservation;
};
