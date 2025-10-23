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
import { getCartWithItems, clearCart, getCartByUser } from '../models/cartModel.js';

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

export const createOrderFromCart = async (req, res, next) => {
  try {
    const { restaurant_id } = req.params;
    const { special_instructions, delivery_address, order_type = 'dine_in' } = req.body;
    const userId = req.user.id;

    // Get cart with items
    const cart = await getCartWithItems(await getCartByUser(userId, restaurant_id).then(c => c.id));
    
    if (!cart || !cart.cart_items || cart.cart_items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cart is empty' 
      });
    }

    // Calculate total amount
    const totalAmount = cart.cart_items.reduce((total, item) => {
      return total + (item.quantity * parseFloat(item.unit_price));
    }, 0);

    // Prepare order data
    const orderData = {
      restaurant_id,
      user_id: userId,
      total_amount: totalAmount,
      status: 'pending',
      order_type,
      special_instructions: special_instructions || null,
      delivery_address: delivery_address || null
    };

    // Prepare order items
    const orderItems = cart.cart_items.map(item => ({
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price: parseFloat(item.unit_price),
      special_requests: item.special_requests
    }));

    // Create order with items
    const order = await createOrderWithItems(orderData, orderItems);

    // Clear cart after successful order creation
    await clearCart(cart.id);

    res.status(201).json({ 
      success: true, 
      data: order, 
      message: 'Order created from cart' 
    });
  } catch (err) {
    next(err);
  }
};

