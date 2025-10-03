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
