/**
 * @swagger
 * components:
 *   schemas:
 *     LoyaltyPoints:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Loyalty account UUID
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: User UUID
 *         points:
 *           type: integer
 *           description: Current points balance
 *         tier:
 *           type: string
 *           description: User tier
 *           enum: [bronze, silver, gold, platinum]
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     Reward:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Reward UUID
 *         title:
 *           type: string
 *           description: Reward title
 *         description:
 *           type: string
 *           description: Reward description
 *         points_required:
 *           type: integer
 *           description: Points required to redeem
 *         category:
 *           type: string
 *           description: Reward category
 *           enum: [food, discount, experience]
 *         valid_days:
 *           type: integer
 *           description: Days until reward expires
 *         restaurant_type:
 *           type: string
 *           description: Applicable restaurant type
 *           enum: [all, premium, select]
 *         is_active:
 *           type: boolean
 *           description: Whether reward is active
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     RewardRedemption:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Redemption UUID
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: User UUID
 *         reward_id:
 *           type: string
 *           format: uuid
 *           description: Reward UUID
 *         points_spent:
 *           type: integer
 *           description: Points spent on redemption
 *         status:
 *           type: string
 *           description: Redemption status
 *           enum: [active, used, expired]
 *         redeemed_at:
 *           type: string
 *           format: date-time
 *           description: Redemption timestamp
 *         expires_at:
 *           type: string
 *           format: date-time
 *           description: Expiry timestamp
 *         used_at:
 *           type: string
 *           format: date-time
 *           description: Usage timestamp
 *         title:
 *           type: string
 *           description: Reward title
 *         description:
 *           type: string
 *           description: Reward description
 *         category:
 *           type: string
 *           description: Reward category
 *     PointsHistory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: History entry UUID
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: User UUID
 *         points:
 *           type: integer
 *           description: Points change (positive or negative)
 *         action:
 *           type: string
 *           description: Action that triggered points change
 *         reference_id:
 *           type: string
 *           format: uuid
 *           description: Reference entity UUID
 *         reference_type:
 *           type: string
 *           description: Reference entity type
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *     AddPointsRequest:
 *       type: object
 *       required:
 *         - user_id
 *         - points
 *         - action
 *       properties:
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: User UUID
 *         points:
 *           type: integer
 *           description: Points to add
 *         action:
 *           type: string
 *           description: Action description
 *         reference_id:
 *           type: string
 *           format: uuid
 *           description: Reference entity UUID
 *         reference_type:
 *           type: string
 *           description: Reference entity type
 */

import express from 'express';
import { getUserPoints, getPointsHistory, getRewards, getReward, getAvailableRewards, redeemReward, getUserRedemptions, useRedemption, addPointsManual } from '../controllers/loyaltyController.js';
import { authenticateToken, authorize } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/loyalty/points:
 *   get:
 *     summary: Get authenticated user's loyalty points
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Loyalty points retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/LoyaltyPoints'
 *                 message:
 *                   type: string
 *                   example: "Loyalty points fetched"
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
router.get('/points', authenticateToken, getUserPoints);

/**
 * @swagger
 * /api/loyalty/points/history:
 *   get:
 *     summary: Get user's points transaction history
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Points history retrieved successfully
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
 *                     $ref: '#/components/schemas/PointsHistory'
 *                 message:
 *                   type: string
 *                   example: "Points history fetched"
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
router.get('/points/history', authenticateToken, getPointsHistory);

/**
 * @swagger
 * /api/loyalty/rewards:
 *   get:
 *     summary: Get all available rewards (public)
 *     tags: [Loyalty]
 *     responses:
 *       200:
 *         description: Rewards retrieved successfully
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
 *                     $ref: '#/components/schemas/Reward'
 *                 message:
 *                   type: string
 *                   example: "Rewards fetched"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/rewards', getRewards);

/**
 * @swagger
 * /api/loyalty/rewards/{id}:
 *   get:
 *     summary: Get reward details (public)
 *     tags: [Loyalty]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reward UUID
 *     responses:
 *       200:
 *         description: Reward retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Reward'
 *                 message:
 *                   type: string
 *                   example: "Reward fetched"
 *       404:
 *         description: Reward not found
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
router.get('/rewards/:id', getReward);

/**
 * @swagger
 * /api/loyalty/rewards/available:
 *   get:
 *     summary: Get rewards user can afford with current points
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Available rewards retrieved successfully
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
 *                     $ref: '#/components/schemas/Reward'
 *                 message:
 *                   type: string
 *                   example: "Available rewards fetched"
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
router.get('/rewards/available', authenticateToken, getAvailableRewards);

/**
 * @swagger
 * /api/loyalty/rewards/{id}/redeem:
 *   post:
 *     summary: Redeem a reward
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reward UUID
 *     responses:
 *       200:
 *         description: Reward redeemed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/RewardRedemption'
 *                 message:
 *                   type: string
 *                   example: "Reward redeemed successfully"
 *       400:
 *         description: Bad request - insufficient points
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
 *       404:
 *         description: Reward not found
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
router.post('/rewards/:id/redeem', authenticateToken, redeemReward);

/**
 * @swagger
 * /api/loyalty/redemptions:
 *   get:
 *     summary: Get user's redemption history
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User redemptions retrieved successfully
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
 *                     $ref: '#/components/schemas/RewardRedemption'
 *                 message:
 *                   type: string
 *                   example: "User redemptions fetched"
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
router.get('/redemptions', authenticateToken, getUserRedemptions);

/**
 * @swagger
 * /api/loyalty/redemptions/{id}/use:
 *   put:
 *     summary: Mark redemption as used
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Redemption UUID
 *     responses:
 *       200:
 *         description: Redemption marked as used successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/RewardRedemption'
 *                 message:
 *                   type: string
 *                   example: "Redemption marked as used"
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Redemption not found
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
router.put('/redemptions/:id/use', authenticateToken, useRedemption);

/**
 * @swagger
 * /api/loyalty/points/add:
 *   post:
 *     summary: Manually add points (admin only)
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddPointsRequest'
 *     responses:
 *       200:
 *         description: Points added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/LoyaltyPoints'
 *                 message:
 *                   type: string
 *                   example: "Points added successfully"
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
router.post('/points/add', authenticateToken, authorize(1), addPointsManual);

export default router;

