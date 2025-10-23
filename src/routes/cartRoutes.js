/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Cart UUID
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
 *         user_name:
 *           type: string
 *           description: User name
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         cart_items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Cart item UUID
 *         cart_id:
 *           type: string
 *           format: uuid
 *           description: Cart UUID
 *         menu_item_id:
 *           type: string
 *           format: uuid
 *           description: Menu item UUID
 *         quantity:
 *           type: integer
 *           description: Quantity of the item
 *           minimum: 1
 *         unit_price:
 *           type: number
 *           format: decimal
 *           description: Price per unit
 *         special_requests:
 *           type: string
 *           description: Special requests for this item
 *         item_name:
 *           type: string
 *           description: Menu item name
 *         item_description:
 *           type: string
 *           description: Menu item description
 *         is_veg:
 *           type: boolean
 *           description: Whether item is vegetarian
 *         spice_level:
 *           type: integer
 *           description: Spice level (0-5)
 *     AddToCartRequest:
 *       type: object
 *       required:
 *         - menu_item_id
 *       properties:
 *         menu_item_id:
 *           type: string
 *           format: uuid
 *           description: Menu item UUID
 *         quantity:
 *           type: integer
 *           description: Quantity to add
 *           minimum: 1
 *           default: 1
 *         special_requests:
 *           type: string
 *           description: Special requests for this item
 *     UpdateCartItemRequest:
 *       type: object
 *       properties:
 *         quantity:
 *           type: integer
 *           description: New quantity
 *           minimum: 0
 *         special_requests:
 *           type: string
 *           description: Special requests for this item
 *     CartResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Cart'
 *         message:
 *           type: string
 *           example: "Cart fetched"
 *     CartTotalResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             total:
 *               type: number
 *               format: decimal
 *               example: 150.00
 *         message:
 *           type: string
 *           example: "Cart total calculated"
 */

import express from 'express';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearUserCart, 
  getCartTotal, 
  deleteUserCart 
} from '../controllers/cartController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/cart/{restaurant_id}:
 *   get:
 *     summary: Get user's cart for a restaurant
 *     tags: [Cart]
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
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Cart not found
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
router.get('/:restaurant_id', authenticateToken, getCart);

/**
 * @swagger
 * /api/cart/{restaurant_id}/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartRequest'
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CartItem'
 *                 message:
 *                   type: string
 *                   example: "Item added to cart"
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:restaurant_id/add', authenticateToken, addToCart);

/**
 * @swagger
 * /api/cart/item/{cart_item_id}:
 *   put:
 *     summary: Update cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cart_item_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Cart item UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartItemRequest'
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CartItem'
 *                 message:
 *                   type: string
 *                   example: "Cart item updated"
 *       400:
 *         description: Bad request - invalid quantity
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
router.put('/item/:cart_item_id', authenticateToken, updateCartItem);

/**
 * @swagger
 * /api/cart/item/{cart_item_id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cart_item_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Cart item UUID
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
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
 *                   example: "Item removed from cart"
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
router.delete('/item/:cart_item_id', authenticateToken, removeFromCart);

/**
 * @swagger
 * /api/cart/{restaurant_id}/clear:
 *   delete:
 *     summary: Clear user's cart
 *     tags: [Cart]
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
 *         description: Cart cleared successfully
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
 *                   example: "Cart cleared"
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
router.delete('/:restaurant_id/clear', authenticateToken, clearUserCart);

/**
 * @swagger
 * /api/cart/{restaurant_id}/total:
 *   get:
 *     summary: Get cart total
 *     tags: [Cart]
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
 *         description: Cart total calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartTotalResponse'
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
router.get('/:restaurant_id/total', authenticateToken, getCartTotal);

/**
 * @swagger
 * /api/cart/{restaurant_id}:
 *   delete:
 *     summary: Delete user's cart
 *     tags: [Cart]
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
 *         description: Cart deleted successfully
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
 *                   example: "Cart deleted"
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
router.delete('/:restaurant_id', authenticateToken, deleteUserCart);

export default router;
