/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Notification UUID
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: User UUID
 *         type:
 *           type: string
 *           description: Notification type
 *           enum: [booking, order, reward, review, promotion]
 *         title:
 *           type: string
 *           description: Notification title
 *         message:
 *           type: string
 *           description: Notification message
 *         reference_id:
 *           type: string
 *           format: uuid
 *           description: Reference entity UUID
 *         reference_type:
 *           type: string
 *           description: Reference entity type
 *           enum: [restaurant, order, reservation]
 *         is_read:
 *           type: boolean
 *           description: Whether notification has been read
 *           default: false
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     NotificationPreferences:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Preferences UUID
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: User UUID
 *         push_notifications:
 *           type: boolean
 *           description: Enable push notifications
 *           default: true
 *         email_notifications:
 *           type: boolean
 *           description: Enable email notifications
 *           default: true
 *         sms_notifications:
 *           type: boolean
 *           description: Enable SMS notifications
 *           default: false
 *         booking_updates:
 *           type: boolean
 *           description: Enable booking update notifications
 *           default: true
 *         order_status:
 *           type: boolean
 *           description: Enable order status notifications
 *           default: true
 *         promotions:
 *           type: boolean
 *           description: Enable promotion notifications
 *           default: true
 *         loyalty_rewards:
 *           type: boolean
 *           description: Enable loyalty reward notifications
 *           default: true
 *         review_reminders:
 *           type: boolean
 *           description: Enable review reminder notifications
 *           default: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     CreateNotificationRequest:
 *       type: object
 *       required:
 *         - user_id
 *         - type
 *         - title
 *         - message
 *       properties:
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: User UUID
 *         type:
 *           type: string
 *           description: Notification type
 *           enum: [booking, order, reward, review, promotion]
 *         title:
 *           type: string
 *           description: Notification title
 *           maxLength: 255
 *         message:
 *           type: string
 *           description: Notification message
 *         reference_id:
 *           type: string
 *           format: uuid
 *           description: Reference entity UUID
 *         reference_type:
 *           type: string
 *           description: Reference entity type
 *           enum: [restaurant, order, reservation]
 *     UpdatePreferencesRequest:
 *       type: object
 *       properties:
 *         push_notifications:
 *           type: boolean
 *           description: Enable push notifications
 *         email_notifications:
 *           type: boolean
 *           description: Enable email notifications
 *         sms_notifications:
 *           type: boolean
 *           description: Enable SMS notifications
 *         booking_updates:
 *           type: boolean
 *           description: Enable booking update notifications
 *         order_status:
 *           type: boolean
 *           description: Enable order status notifications
 *         promotions:
 *           type: boolean
 *           description: Enable promotion notifications
 *         loyalty_rewards:
 *           type: boolean
 *           description: Enable loyalty reward notifications
 *         review_reminders:
 *           type: boolean
 *           description: Enable review reminder notifications
 */

import express from 'express';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification, getPreferences, updatePreferences, createNotification } from '../controllers/notificationController.js';
import { authenticateToken, authorize } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user's notifications with pagination
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *         description: Number of notifications to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         description: Number of notifications to skip
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *                 message:
 *                   type: string
 *                   example: "Notifications fetched"
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authenticateToken, getNotifications);

/**
 * @swagger
 * /api/notifications/unread/count:
 *   get:
 *     summary: Get count of unread notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     unread_count:
 *                       type: integer
 *                       example: 5
 *                 message:
 *                   type: string
 *                   example: "Unread count fetched"
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/unread/count', authenticateToken, getUnreadCount);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Notification UUID
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *                 message:
 *                   type: string
 *                   example: "Notification marked as read"
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Notification not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id/read', authenticateToken, markAsRead);

/**
 * @swagger
 * /api/notifications/read-all:
 *   put:
 *     summary: Mark all user notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "All notifications marked as read"
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/read-all', authenticateToken, markAllAsRead);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Notification UUID
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Notification deleted"
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Notification not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authenticateToken, deleteNotification);

/**
 * @swagger
 * /api/notifications/preferences:
 *   get:
 *     summary: Get user's notification preferences
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification preferences retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/NotificationPreferences'
 *                 message:
 *                   type: string
 *                   example: "Notification preferences fetched"
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/preferences', authenticateToken, getPreferences);

/**
 * @swagger
 * /api/notifications/preferences:
 *   put:
 *     summary: Update notification preferences
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePreferencesRequest'
 *     responses:
 *       200:
 *         description: Notification preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/NotificationPreferences'
 *                 message:
 *                   type: string
 *                   example: "Notification preferences updated"
 *       400:
 *         description: Bad request - no valid preference fields provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/preferences', authenticateToken, updatePreferences);

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create notification (admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNotificationRequest'
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *                 message:
 *                   type: string
 *                   example: "Notification created"
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticateToken, authorize(1), createNotification);

export default router;

