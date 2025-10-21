import db from './db.js';

export const getAllOrders = async () => {
  return await db('orders')
    .select(
      'orders.*',
      'restaurants.name as restaurant_name',
      'users.full_name as user_name',
      'users.email as user_email'
    )
    .leftJoin('restaurants', 'orders.restaurant_id', 'restaurants.id')
    .leftJoin('users', 'orders.user_id', 'users.id')
    .orderBy('orders.created_at', 'desc');
};

export const getOrderById = async (id) => {
  return await db('orders')
    .select(
      'orders.*',
      'restaurants.name as restaurant_name',
      'restaurants.address as restaurant_address',
      'users.full_name as user_name',
      'users.email as user_email'
    )
    .leftJoin('restaurants', 'orders.restaurant_id', 'restaurants.id')
    .leftJoin('users', 'orders.user_id', 'users.id')
    .where('orders.id', id)
    .first();
};

export const createOrder = async (orderData) => {
  return await db('orders').insert(orderData).returning('*');
};

export const updateOrder = async (id, orderData) => {
  return await db('orders').where({ id }).update(orderData).returning('*');
};

export const deleteOrder = async (id) => {
  return await db('orders').where({ id }).del();
};

export const getOrdersByUser = async (userId) => {
  return await db('orders')
    .select(
      'orders.*',
      'restaurants.name as restaurant_name',
      'restaurants.address as restaurant_address',
      'restaurants.cuisine_type'
    )
    .leftJoin('restaurants', 'orders.restaurant_id', 'restaurants.id')
    .where('orders.user_id', userId)
    .orderBy('orders.created_at', 'desc');
};

export const getOrdersByRestaurant = async (restaurantId) => {
  return await db('orders')
    .select(
      'orders.*',
      'users.full_name as user_name',
      'users.email as user_email'
    )
    .leftJoin('users', 'orders.user_id', 'users.id')
    .where('orders.restaurant_id', restaurantId)
    .orderBy('orders.created_at', 'desc');
};

export const getOrderWithItems = async (orderId) => {
  const order = await getOrderById(orderId);
  if (!order) return null;

  const orderItems = await db('order_items')
    .select(
      'order_items.*',
      'menu_items.name as item_name',
      'menu_items.description as item_description',
      'menu_items.price as item_price'
    )
    .leftJoin('menu_items', 'order_items.menu_item_id', 'menu_items.id')
    .where('order_items.order_id', orderId);

  return {
    ...order,
    order_items: orderItems
  };
};

export const createOrderWithItems = async (orderData, orderItems) => {
  return await db.transaction(async (trx) => {
    const [order] = await trx('orders').insert(orderData).returning('*');
    
    const itemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }));
    
    await trx('order_items').insert(itemsWithOrderId);
    
    return order;
  });
};

