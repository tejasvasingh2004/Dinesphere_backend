import db from './db.js';

export const getUserNotifications = async (userId, limit = 20, offset = 0) => {
  return await db('notifications')
    .where('user_id', userId)
    .orderBy('is_read', 'asc')
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);
};

export const getUnreadCount = async (userId) => {
  const result = await db('notifications')
    .where('user_id', userId)
    .where('is_read', false)
    .count('* as count')
    .first();
  
  return parseInt(result.count);
};

export const createNotification = async (notificationData) => {
  return await db('notifications').insert(notificationData).returning('*');
};

export const markAsRead = async (notificationId) => {
  return await db('notifications')
    .where('id', notificationId)
    .update({ is_read: true })
    .returning('*');
};

export const markAllAsRead = async (userId) => {
  return await db('notifications')
    .where('user_id', userId)
    .where('is_read', false)
    .update({ is_read: true });
};

export const deleteNotification = async (notificationId) => {
  return await db('notifications')
    .where('id', notificationId)
    .del();
};

export const getUserPreferences = async (userId) => {
  return await db('notification_preferences')
    .where('user_id', userId)
    .first();
};

export const updateUserPreferences = async (userId, preferences) => {
  return await db('notification_preferences')
    .where('user_id', userId)
    .update(preferences)
    .returning('*');
};

export const createDefaultPreferences = async (userId) => {
  return await db('notification_preferences')
    .insert({
      user_id: userId,
      push_notifications: true,
      email_notifications: true,
      sms_notifications: false,
      booking_updates: true,
      order_status: true,
      promotions: true,
      loyalty_rewards: true,
      review_reminders: true
    })
    .returning('*');
};

