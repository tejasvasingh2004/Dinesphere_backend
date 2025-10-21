import db from './db.js';

export const getAllPayments = async () => {
  return await db('payments')
    .select(
      'payments.*',
      'orders.total_amount as order_amount',
      'orders.status as order_status',
      'users.full_name as user_name',
      'users.email as user_email'
    )
    .leftJoin('orders', 'payments.order_id', 'orders.id')
    .leftJoin('users', 'orders.user_id', 'users.id')
    .orderBy('payments.created_at', 'desc');
};

export const getPaymentById = async (id) => {
  return await db('payments')
    .select(
      'payments.*',
      'orders.total_amount as order_amount',
      'orders.status as order_status',
      'orders.restaurant_id',
      'users.full_name as user_name',
      'users.email as user_email'
    )
    .leftJoin('orders', 'payments.order_id', 'orders.id')
    .leftJoin('users', 'orders.user_id', 'users.id')
    .where('payments.id', id)
    .first();
};

export const createPayment = async (paymentData) => {
  return await db('payments').insert(paymentData).returning('*');
};

export const updatePayment = async (id, paymentData) => {
  return await db('payments').where({ id }).update(paymentData).returning('*');
};

export const deletePayment = async (id) => {
  return await db('payments').where({ id }).del();
};

export const getPaymentsByOrder = async (orderId) => {
  return await db('payments')
    .select('*')
    .where('order_id', orderId)
    .orderBy('created_at', 'desc');
};

export const getPaymentsByUser = async (userId) => {
  return await db('payments')
    .select(
      'payments.*',
      'orders.total_amount as order_amount',
      'orders.status as order_status',
      'restaurants.name as restaurant_name'
    )
    .leftJoin('orders', 'payments.order_id', 'orders.id')
    .leftJoin('restaurants', 'orders.restaurant_id', 'restaurants.id')
    .where('orders.user_id', userId)
    .orderBy('payments.created_at', 'desc');
};

