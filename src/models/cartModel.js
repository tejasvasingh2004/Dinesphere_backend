import db from './db.js';

export const getCartByUser = async (userId, restaurantId) => {
  return await db('carts')
    .where({ user_id: userId, restaurant_id: restaurantId })
    .first();
};

export const createCart = async (userId, restaurantId) => {
  const [cart] = await db('carts')
    .insert({
      user_id: userId,
      restaurant_id: restaurantId
    })
    .returning('*');
  return cart;
};

export const getOrCreateCart = async (userId, restaurantId) => {
  let cart = await getCartByUser(userId, restaurantId);
  if (!cart) {
    cart = await createCart(userId, restaurantId);
  }
  return cart;
};

export const getCartWithItems = async (cartId) => {
  const cart = await db('carts')
    .select(
      'carts.*',
      'restaurants.name as restaurant_name',
      'users.full_name as user_name'
    )
    .leftJoin('restaurants', 'carts.restaurant_id', 'restaurants.id')
    .leftJoin('users', 'carts.user_id', 'users.id')
    .where('carts.id', cartId)
    .first();

  if (!cart) return null;

  const cartItems = await db('cart_items')
    .select(
      'cart_items.*',
      'menu_items.name as item_name',
      'menu_items.description as item_description',
      'menu_items.price as menu_price',
      'menu_items.is_veg',
      'menu_items.spice_level'
    )
    .leftJoin('menu_items', 'cart_items.menu_item_id', 'menu_items.id')
    .where('cart_items.cart_id', cartId);

  return {
    ...cart,
    cart_items: cartItems
  };
};

export const addItemToCart = async (cartId, menuItemId, quantity = 1, specialRequests = null) => {
  // Get menu item details for price
  const menuItem = await db('menu_items').where({ id: menuItemId }).first();
  if (!menuItem) {
    throw new Error('Menu item not found');
  }

  // Check if item already exists in cart
  const existingItem = await db('cart_items')
    .where({ cart_id: cartId, menu_item_id: menuItemId })
    .first();

  if (existingItem) {
    // Update quantity
    return await db('cart_items')
      .where({ id: existingItem.id })
      .update({
        quantity: existingItem.quantity + quantity,
        special_requests: specialRequests || existingItem.special_requests
      })
      .returning('*');
  } else {
    // Add new item
    return await db('cart_items')
      .insert({
        cart_id: cartId,
        menu_item_id: menuItemId,
        quantity,
        unit_price: menuItem.price,
        special_requests: specialRequests
      })
      .returning('*');
  }
};

export const updateCartItem = async (cartItemId, quantity, specialRequests = null) => {
  if (quantity <= 0) {
    return await db('cart_items').where({ id: cartItemId }).del();
  }

  return await db('cart_items')
    .where({ id: cartItemId })
    .update({
      quantity,
      special_requests: specialRequests
    })
    .returning('*');
};

export const removeItemFromCart = async (cartItemId) => {
  return await db('cart_items').where({ id: cartItemId }).del();
};

export const clearCart = async (cartId) => {
  return await db('cart_items').where({ cart_id: cartId }).del();
};

export const getCartTotal = async (cartId) => {
  const items = await db('cart_items')
    .select('quantity', 'unit_price')
    .where('cart_id', cartId);

  return items.reduce((total, item) => {
    return total + (item.quantity * parseFloat(item.unit_price));
  }, 0);
};

export const deleteCart = async (cartId) => {
  return await db('carts').where({ id: cartId }).del();
};
