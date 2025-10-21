/**
 * @swagger
 * components:
 *   schemas:
 *     Favorite:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Favorite UUID
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: User UUID
 *         restaurant_id:
 *           type: string
 *           format: uuid
 *           description: Restaurant UUID
 *         restaurant_name:
 *           type: string
 *           description: Restaurant name
 *         description:
 *           type: string
 *           description: Restaurant description
 *         cuisine:
 *           type: string
 *           description: Restaurant cuisine type
 *         rating:
 *           type: number
 *           format: decimal
 *           description: Restaurant rating
 *         price_range:
 *           type: string
 *           description: Restaurant price range
 *         location:
 *           type: string
 *           description: Restaurant location
 *         image:
 *           type: string
 *           description: Restaurant image URL
 *         open_time:
 *           type: string
 *           description: Restaurant opening hours
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     FavoriteStatus:
 *       type: object
 *       properties:
 *         is_favorite:
 *           type: boolean
 *           description: Whether restaurant is favorited
 *     FavoritesListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Favorite'
 *         message:
 *           type: string
 *           example: "Favorites fetched"
 *     FavoriteStatusResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/FavoriteStatus'
 *         message:
 *           type: string
 *           example: "Favorite status checked"
 */

import express from 'express';
import { getFavorites, addFavorite, removeFavorite, checkFavorite } from '../controllers/favoriteController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get user's favorite restaurants
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorites retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoritesListResponse'
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
router.get('/', authenticateToken, getFavorites);

/**
 * @swagger
 * /api/favorites/{restaurant_id}:
 *   post:
 *     summary: Add restaurant to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurant_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Restaurant UUID
 *     responses:
 *       201:
 *         description: Restaurant added to favorites successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Favorite'
 *                 message:
 *                   type: string
 *                   example: "Restaurant added to favorites"
 *       200:
 *         description: Restaurant already in favorites
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
 *                   example: "Restaurant already in favorites"
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Restaurant not found
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
router.post('/:restaurant_id', authenticateToken, addFavorite);

/**
 * @swagger
 * /api/favorites/{restaurant_id}:
 *   delete:
 *     summary: Remove restaurant from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurant_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Restaurant UUID
 *     responses:
 *       200:
 *         description: Restaurant removed from favorites successfully
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
 *                   example: "Restaurant removed from favorites"
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Restaurant not found in favorites
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
router.delete('/:restaurant_id', authenticateToken, removeFavorite);

/**
 * @swagger
 * /api/favorites/{restaurant_id}/check:
 *   get:
 *     summary: Check if restaurant is favorited
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurant_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Restaurant UUID
 *     responses:
 *       200:
 *         description: Favorite status checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoriteStatusResponse'
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
router.get('/:restaurant_id/check', authenticateToken, checkFavorite);

export default router;

