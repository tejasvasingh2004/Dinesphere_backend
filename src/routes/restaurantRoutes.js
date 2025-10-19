/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Restaurant UUID
 *         owner_id:
 *           type: string
 *           format: uuid
 *           description: Owner user UUID
 *         name:
 *           type: string
 *           description: Restaurant name
 *         description:
 *           type: string
 *           description: Restaurant description
 *         website:
 *           type: string
 *           description: Restaurant website URL
 *         cuisine:
 *           type: string
 *           description: Type of cuisine
 *         rating:
 *           type: number
 *           format: float
 *           description: Restaurant rating
 *         price_range:
 *           type: string
 *           description: Price range (e.g., "₹2500-10000")
 *         location:
 *           type: string
 *           description: Restaurant location
 *         image:
 *           type: string
 *           description: Restaurant image URL
 *         open_time:
 *           type: string
 *           description: Opening hours
 *         available_slots:
 *           type: integer
 *           description: Number of available booking slots
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     CreateRestaurantRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         owner_id:
 *           type: string
 *           format: uuid
 *           description: Owner user UUID
 *         name:
 *           type: string
 *           description: Restaurant name
 *         description:
 *           type: string
 *           description: Restaurant description
 *         website:
 *           type: string
 *           description: Restaurant website URL
 *         cuisine:
 *           type: string
 *           description: Type of cuisine
 *         rating:
 *           type: number
 *           format: float
 *           description: Restaurant rating
 *         price_range:
 *           type: string
 *           description: Price range
 *         location:
 *           type: string
 *           description: Restaurant location
 *         image:
 *           type: string
 *           description: Restaurant image URL
 *         open_time:
 *           type: string
 *           description: Opening hours
 *         available_slots:
 *           type: integer
 *           description: Number of available booking slots
 *     UpdateRestaurantRequest:
 *       type: object
 *       properties:
 *         owner_id:
 *           type: string
 *           format: uuid
 *           description: Owner user UUID
 *         name:
 *           type: string
 *           description: Restaurant name
 *         description:
 *           type: string
 *           description: Restaurant description
 *         website:
 *           type: string
 *           description: Restaurant website URL
 *         cuisine:
 *           type: string
 *           description: Type of cuisine
 *         rating:
 *           type: number
 *           format: float
 *           description: Restaurant rating
 *         price_range:
 *           type: string
 *           description: Price range
 *         location:
 *           type: string
 *           description: Restaurant location
 *         image:
 *           type: string
 *           description: Restaurant image URL
 *         open_time:
 *           type: string
 *           description: Opening hours
 *         available_slots:
 *           type: integer
 *           description: Number of available booking slots
 *     RestaurantResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Restaurant'
 *         message:
 *           type: string
 *           example: "Restaurant fetched"
 *     RestaurantsListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Restaurant'
 *         message:
 *           type: string
 *           example: "Restaurants fetched"
 */

import express from 'express';
import { 
  getRestaurants, 
  getRestaurant, 
  create, 
  update, 
  remove,
  getRestaurantsByOwner,
  updateRating
} from '../controllers/restaurantController.js';
import { authenticateToken, authorize } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all restaurants with filtering, sorting, and pagination
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by restaurant name, description, cuisine, or location
 *       - in: query
 *         name: cuisine
 *         schema:
 *           type: string
 *         description: Filter by cuisine type
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: price_min
 *         schema:
 *           type: integer
 *         description: Minimum price range
 *       - in: query
 *         name: price_max
 *         schema:
 *           type: integer
 *         description: Maximum price range
 *       - in: query
 *         name: rating_min
 *         schema:
 *           type: number
 *         description: Minimum rating
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [rating, price_low, price_high, name, newest]
 *         description: Sort restaurants by criteria
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of restaurants per page
 *     responses:
 *       200:
 *         description: Restaurants retrieved successfully
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
 *                     $ref: '#/components/schemas/Restaurant'
 *                 message:
 *                   type: string
 *                   example: "Restaurants fetched successfully"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getRestaurants);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Restaurant UUID
 *     responses:
 *       200:
 *         description: Restaurant retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RestaurantResponse'
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
router.get('/:id', getRestaurant);

/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateRestaurantRequest'
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RestaurantResponse'
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
router.post('/', authenticateToken, authorize(1), create);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   put:
 *     summary: Update restaurant by ID
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Restaurant UUID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRestaurantRequest'
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RestaurantResponse'
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
router.put('/:id', authenticateToken, authorize(1), update);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Delete restaurant by ID
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Restaurant UUID
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
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
 *                   example: "Restaurant deleted"
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
router.delete('/:id', authenticateToken, authorize(1), remove);

/**
 * @swagger
 * /api/restaurants/owner/{owner_id}:
 *   get:
 *     summary: Get restaurants by owner
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: owner_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Owner user UUID
 *     responses:
 *       200:
 *         description: Owner restaurants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RestaurantsListResponse'
 *       400:
 *         description: Bad request - missing owner ID
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
router.get('/owner/:owner_id', authenticateToken, getRestaurantsByOwner);

/**
 * @swagger
 * /api/restaurants/{id}/rating:
 *   put:
 *     summary: Update restaurant rating
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Restaurant UUID
 *     responses:
 *       200:
 *         description: Restaurant rating updated successfully
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
 *                     rating:
 *                       type: number
 *                       format: float
 *                     review_count:
 *                       type: integer
 *                 message:
 *                   type: string
 *                   example: "Restaurant rating updated successfully"
 *       400:
 *         description: Bad request - missing restaurant ID
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
router.put('/:id/rating', authenticateToken, updateRating);

export default router;
