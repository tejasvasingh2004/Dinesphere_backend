import db from './db.js';

export const getAllMenuItems = async () => {
  return await db('menu_items').select('*');
};

export const getMenuItemById = async (id) => {
  return await db('menu_items').where({ id }).first();
};

export const createMenuItem = async (menuItemData) => {
  // Handle category lookup/creation
  if (menuItemData.category && !menuItemData.category_id) {
    const categoryName = menuItemData.category;
    const restaurantId = menuItemData.restaurant_id;

    // Check if category exists for this restaurant
    let category = await db('menu_categories')
      .where({ restaurant_id: restaurantId, name: categoryName })
      .first();

    if (!category) {
      // Create new category
      [category] = await db('menu_categories')
        .insert({
          restaurant_id: restaurantId,
          name: categoryName
        })
        .returning('*');
    }

    // Replace category string with category_id
    menuItemData.category_id = category.id;
    delete menuItemData.category;
  }

  // Map available to is_available
  if (menuItemData.available !== undefined) {
    menuItemData.is_available = menuItemData.available;
    delete menuItemData.available;
  }

  return await db('menu_items').insert(menuItemData).returning('*');
};

export const updateMenuItem = async (id, menuItemData) => {
  // Handle category lookup/creation for updates
  if (menuItemData.category && !menuItemData.category_id) {
    const categoryName = menuItemData.category;
    const restaurantId = menuItemData.restaurant_id;

    // Check if category exists for this restaurant
    let category = await db('menu_categories')
      .where({ restaurant_id: restaurantId, name: categoryName })
      .first();

    if (!category) {
      // Create new category
      [category] = await db('menu_categories')
        .insert({
          restaurant_id: restaurantId,
          name: categoryName,
          position: 0
        })
        .returning('*');
    }

    // Replace category string with category_id
    menuItemData.category_id = category.id;
    delete menuItemData.category;
  }

  // Map available to is_available
  if (menuItemData.available !== undefined) {
    menuItemData.is_available = menuItemData.available;
    delete menuItemData.available;
  }

  return await db('menu_items').where({ id }).update(menuItemData).returning('*');
};

export const deleteMenuItem = async (id) => {
  return await db('menu_items').where({ id }).del();
};

export const getMenuItemsByRestaurant = async (restaurantId) => {
  return await db('menu_items')
    .leftJoin('menu_categories', 'menu_items.category_id', 'menu_categories.id')
    .where({ 'menu_items.restaurant_id': restaurantId })
    .select(
      'menu_items.*',
      'menu_categories.name as category'
    );
};
