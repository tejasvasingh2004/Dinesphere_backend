/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: User UUID
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *         full_name:
 *           type: string
 *           description: User's full name
 *         phone:
 *           type: string
 *           description: User's phone number
 *         role_id:
 *           type: integer
 *           description: User role ID (1=admin, 2=manager, 3=customer)
 *         is_active:
 *           type: boolean
 *           description: Whether the user account is active
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     UsersListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         message:
 *           type: string
 *           example: "Users fetched"
 */

// routes/userRoutes.js
import express from 'express';
import { authenticateToken, authorize } from '../middlewares/auth.js';
import { getProfile, updateProfile, getOrderHistory, getReservationHistory, getStatistics, updatePreferences } from '../controllers/userController.js';
import db from '../models/db.js';

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersListResponse'
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
router.get('/', authenticateToken, authorize(1), async (req, res) => {
  // only accessible if JWT valid and admin
  const users = await db('users');
  res.json({ success: true, data: users, message: 'Users fetched' });
});

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "Profile fetched"
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
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
router.get('/profile', authenticateToken, getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 description: User's full name
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *               dietary_preferences:
 *                 type: string
 *                 description: User's dietary preferences
 *               address:
 *                 type: string
 *                 description: User's address
 *               bio:
 *                 type: string
 *                 description: User's bio
 *               avatar_url:
 *                 type: string
 *                 description: User's avatar URL
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "Profile updated"
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
router.put('/profile', authenticateToken, updateProfile);

/**
 * @swagger
 * /api/users/profile/orders:
 *   get:
 *     summary: Get user's order history
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order history retrieved successfully
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
 *                     $ref: '#/components/schemas/Order'
 *                 message:
 *                   type: string
 *                   example: "Order history fetched"
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
router.get('/profile/orders', authenticateToken, getOrderHistory);

/**
 * @swagger
 * /api/users/profile/reservations:
 *   get:
 *     summary: Get user's reservation history
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reservation history retrieved successfully
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
 *                     $ref: '#/components/schemas/Reservation'
 *                 message:
 *                   type: string
 *                   example: "Reservation history fetched"
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
router.get('/profile/reservations', authenticateToken, getReservationHistory);

/**
 * @swagger
 * /api/users/profile/statistics:
 *   get:
 *     summary: Get user statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
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
 *                     orders:
 *                       type: object
 *                       properties:
 *                         total_orders:
 *                           type: integer
 *                           description: Total number of orders
 *                         total_spent:
 *                           type: number
 *                           format: decimal
 *                           description: Total amount spent
 *                         average_order_value:
 *                           type: number
 *                           format: decimal
 *                           description: Average order value
 *                     reservations:
 *                       type: object
 *                       properties:
 *                         total_reservations:
 *                           type: integer
 *                           description: Total number of reservations
 *                     loyalty:
 *                       type: object
 *                       properties:
 *                         points:
 *                           type: integer
 *                           description: Current loyalty points
 *                         tier:
 *                           type: string
 *                           description: Current loyalty tier
 *                     favorites:
 *                       type: object
 *                       properties:
 *                         total_favorites:
 *                           type: integer
 *                           description: Total number of favorite restaurants
 *                     reviews:
 *                       type: object
 *                       properties:
 *                         total_reviews:
 *                           type: integer
 *                           description: Total number of reviews written
 *                 message:
 *                   type: string
 *                   example: "User statistics fetched"
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
router.get('/profile/statistics', authenticateToken, getStatistics);

/**
 * @swagger
 * /api/users/profile/preferences:
 *   put:
 *     summary: Update user preferences
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dietary_preferences:
 *                 type: string
 *                 description: User's dietary preferences
 *               address:
 *                 type: string
 *                 description: User's address
 *               bio:
 *                 type: string
 *                 description: User's bio
 *               avatar_url:
 *                 type: string
 *                 description: User's avatar URL
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "Preferences updated"
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
router.put('/profile/preferences', authenticateToken, updatePreferences);

export default router;
