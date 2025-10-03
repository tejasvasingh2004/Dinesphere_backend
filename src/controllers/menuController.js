import { getAllMenuItems, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem, getMenuItemsByRestaurant } from '../models/menuModel.js';

export const getMenus = async (req, res, next) => {
  try {
    const menus = await getAllMenuItems();
    res.json({ success: true, data: menus, message: 'Menu items fetched' });
  } catch (err) {
    next(err);
  }
};

export const getMenu = async (req, res, next) => {
  try {
    const menu = await getMenuItemById(req.params.id);
    if (!menu) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.json({ success: true, data: menu, message: 'Menu item fetched' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const [menu] = await createMenuItem(req.body);
    res.status(201).json({ success: true, data: menu, message: 'Menu item created' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const [menu] = await updateMenuItem(req.params.id, req.body);
    res.json({ success: true, data: menu, message: 'Menu item updated' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteMenuItem(req.params.id);
    res.json({ success: true, message: 'Menu item deleted' });
  } catch (err) {
    next(err);
  }
};

export const getMenusByRestaurant = async (req, res, next) => {
  try {
    const menus = await getMenuItemsByRestaurant(req.params.restaurant_id);
    res.json({ success: true, data: menus, message: 'Menu items for restaurant fetched' });
  } catch (err) {
    next(err);
  }
};
