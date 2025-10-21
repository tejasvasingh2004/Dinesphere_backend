import { 
  getAllOrders, 
  getOrderById, 
  createOrder, 
  updateOrder, 
  deleteOrder, 
  getOrdersByUser, 
  getOrdersByRestaurant, 
  getOrderWithItems,
  createOrderWithItems 
} from '../models/orderModel.js';

export const getOrders = async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    res.json({ success: true, data: orders, message: 'Orders fetched' });
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await getOrderWithItems(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order, message: 'Order fetched' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    // Validate required fields
    const { restaurant_id, user_id, total_amount, order_items } = req.body;
    if (!restaurant_id || !user_id || !total_amount || !order_items || !Array.isArray(order_items)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: restaurant_id, user_id, total_amount, and order_items array' 
      });
    }

    // Validate order_items structure
    for (const item of order_items) {
      if (!item.menu_item_id || !item.quantity || !item.price) {
        return res.status(400).json({ 
          success: false, 
          message: 'Each order item must have menu_item_id, quantity, and price' 
        });
      }
    }

    const orderData = {
      restaurant_id,
      user_id,
      total_amount,
      status: req.body.status || 'pending',
      special_instructions: req.body.special_instructions || null,
      delivery_address: req.body.delivery_address || null
    };

    const order = await createOrderWithItems(orderData, order_items);
    res.status(201).json({ success: true, data: order, message: 'Order created' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const [order] = await updateOrder(req.params.id, req.body);
    res.json({ success: true, data: order, message: 'Order updated' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteOrder(req.params.id);
    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    next(err);
  }
};

export const getOrdersByUserId = async (req, res, next) => {
  try {
    const orders = await getOrdersByUser(req.params.user_id);
    res.json({ success: true, data: orders, message: 'Orders for user fetched' });
  } catch (err) {
    next(err);
  }
};

export const getOrdersByRestaurantId = async (req, res, next) => {
  try {
    const orders = await getOrdersByRestaurant(req.params.restaurant_id);
    res.json({ success: true, data: orders, message: 'Orders for restaurant fetched' });
  } catch (err) {
    next(err);
  }
};

