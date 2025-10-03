/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *         password:
 *           type: string
 *           format: password
 *           description: User password
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - role_id
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *         password:
 *           type: string
 *           format: password
 *           description: User password
 *         full_name:
 *           type: string
 *           description: User's full name
 *         phone:
 *           type: string
 *           description: User's phone number
 *         role_id:
 *           type: integer
 *           description: User role ID (1=admin, 2=user)
 *           default: 2
 *     RegisterRestaurantRequest:
 *       type: object
 *       required:
 *         - owner_id
 *         - name
 *       properties:
 *         owner_id:
 *           type: string
 *           format: uuid
 *           description: UUID of the restaurant owner (user)
 *         name:
 *           type: string
 *           description: Restaurant name
 *         description:
 *           type: string
 *           description: Restaurant description
 *         website:
 *           type: string
 *           description: Restaurant website URL
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: JWT authentication token
 *             user:
 *               $ref: '#/components/schemas/User'
 *         message:
 *           type: string
 *           example: "Login successful"
 */

// routes/authRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import knex from 'knex';
import knexConfig from '../../knexfile.js';

const router = express.Router();
const db = knex(knexConfig.development);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid credentials
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
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    // sign JWT
    const token = jwt.sign({ id: user.id, email: user.email, role_id: user.role_id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          role_id: user.role_id
        }
      },
      message: 'Login successful.'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login.'
    });
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - missing required fields or email already exists
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
import { register, registerRestaurant } from '../controllers/authController.js';

router.post('/register', register);

/**
 * @swagger
 * /api/auth/register-restaurant:
 *   post:
 *     summary: Restaurant registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRestaurantRequest'
 *     responses:
 *       201:
 *         description: Restaurant registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - missing required fields, owner doesn't exist, or restaurant name already exists
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
router.post('/register-restaurant', registerRestaurant);

export default router;
