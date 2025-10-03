import db from './db.js';

export const getAllMenuItems = async () => {
  return await db('menu_items').select('*');
};

export const getMenuItemById = async (id) => {
  return await db('menu_items').where({ id }).first();
};

export const createMenuItem = async (menuItemData) => {
  return await db('menu_items').insert(menuItemData).returning('*');
};

export const updateMenuItem = async (id, menuItemData) => {
  return await db('menu_items').where({ id }).update(menuItemData).returning('*');
};

export const deleteMenuItem = async (id) => {
  return await db('menu_items').where({ id }).del();
};

export const getMenuItemsByRestaurant = async (restaurantId) => {
  return await db('menu_items').where({ restaurant_id: restaurantId });
};
