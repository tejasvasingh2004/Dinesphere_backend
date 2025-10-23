import {
  getCartByUser,
  getOrCreateCart,
  getCartWithItems,
  addItemToCart,
  updateCartItem as updateCartItemModel,
  removeItemFromCart,
  clearCart,
  getCartTotal as getCartTotalModel,
  deleteCart
} from '../models/cartModel.js';

export const getCart = async (req, res, next) => {
  try {
    const { restaurant_id } = req.params;
    const userId = req.user.id;

    const cart = await getCartWithItems(await getOrCreateCart(userId, restaurant_id).then(c => c.id));
    
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    res.json({ success: true, data: cart, message: 'Cart fetched' });
  } catch (err) {
    next(err);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { restaurant_id } = req.params;
    const { menu_item_id, quantity = 1, special_requests } = req.body;
    const userId = req.user.id;

    if (!menu_item_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'menu_item_id is required' 
      });
    }

    const cart = await getOrCreateCart(userId, restaurant_id);
    const cartItem = await addItemToCart(cart.id, menu_item_id, quantity, special_requests);

    res.json({ success: true, data: cartItem, message: 'Item added to cart' });
  } catch (err) {
    next(err);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { cart_item_id } = req.params;
    const { quantity, special_requests } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quantity cannot be negative' 
      });
    }

    const result = await updateCartItemModel(cart_item_id, quantity, special_requests);
    
    if (quantity === 0) {
      res.json({ success: true, message: 'Item removed from cart' });
    } else {
      res.json({ success: true, data: result, message: 'Cart item updated' });
    }
  } catch (err) {
    next(err);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { cart_item_id } = req.params;
    
    await removeItemFromCart(cart_item_id);
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (err) {
    next(err);
  }
};

export const clearUserCart = async (req, res, next) => {
  try {
    const { restaurant_id } = req.params;
    const userId = req.user.id;

    const cart = await getCartByUser(userId, restaurant_id);
    if (cart) {
      await clearCart(cart.id);
    }

    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
};

export const getCartTotal = async (req, res, next) => {
  try {
    const { restaurant_id } = req.params;
    const userId = req.user.id;

    const cart = await getCartByUser(userId, restaurant_id);
    if (!cart) {
      return res.json({ success: true, data: { total: 0 }, message: 'Cart is empty' });
    }

    const total = await getCartTotalModel(cart.id);
    res.json({ success: true, data: { total }, message: 'Cart total calculated' });
  } catch (err) {
    next(err);
  }
};

export const deleteUserCart = async (req, res, next) => {
  try {
    const { restaurant_id } = req.params;
    const userId = req.user.id;

    const cart = await getCartByUser(userId, restaurant_id);
    if (cart) {
      await deleteCart(cart.id);
    }

    res.json({ success: true, message: 'Cart deleted' });
  } catch (err) {
    next(err);
  }
};
