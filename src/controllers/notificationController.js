import {
  getUserNotifications,
  getUnreadCount as getUnreadCountModel,
  createNotification as createNotificationModel,
  markAsRead as markAsReadModel,
  markAllAsRead as markAllAsReadModel,
  deleteNotification as deleteNotificationModel,
  getUserPreferences,
  updateUserPreferences,
  createDefaultPreferences
} from '../models/notificationModel.js';

export const getNotifications = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    
    const notifications = await getUserNotifications(req.user.id, limit, offset);
    res.json({ success: true, data: notifications, message: 'Notifications fetched' });
  } catch (err) {
    next(err);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await getUnreadCountModel(req.user.id);
    res.json({ success: true, data: { unread_count: count }, message: 'Unread count fetched' });
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await markAsReadModel(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, data: notification, message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await markAllAsReadModel(req.user.id);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const deleted = await deleteNotificationModel(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    next(err);
  }
};

export const getPreferences = async (req, res, next) => {
  try {
    let preferences = await getUserPreferences(req.user.id);
    
    // Create default preferences if they don't exist
    if (!preferences) {
      const [newPreferences] = await createDefaultPreferences(req.user.id);
      preferences = newPreferences;
    }
    
    res.json({ success: true, data: preferences, message: 'Notification preferences fetched' });
  } catch (err) {
    next(err);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    const allowedFields = [
      'push_notifications',
      'email_notifications', 
      'sms_notifications',
      'booking_updates',
      'order_status',
      'promotions',
      'loyalty_rewards',
      'review_reminders'
    ];
    
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No valid preference fields provided' 
      });
    }
    
    const [preferences] = await updateUserPreferences(req.user.id, updateData);
    res.json({ success: true, data: preferences, message: 'Notification preferences updated' });
  } catch (err) {
    next(err);
  }
};

export const createNotification = async (req, res, next) => {
  try {
    const { user_id, type, title, message, reference_id, reference_type } = req.body;
    
    if (!user_id || !type || !title || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: user_id, type, title, message' 
      });
    }
    
    const notificationData = {
      user_id,
      type,
      title,
      message,
      reference_id: reference_id || null,
      reference_type: reference_type || null
    };
    
    const [notification] = await createNotificationModel(notificationData);
    res.status(201).json({ success: true, data: notification, message: 'Notification created' });
  } catch (err) {
    next(err);
  }
};

