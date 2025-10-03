import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger.js';

// Import routes
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import restaurantRoutes from './src/routes/restaurantRoutes.js';
import reservationRoutes from './src/routes/reservationRoutes.js';
import menuRoutes from './src/routes/menuRoutes.js';

// Import middleware
import { errorHandler } from './src/utils/response.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Updated CORS configuration to allow all origins for testing
app.use(cors({
  origin: '*',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/menus', menuRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true
  }
}));

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Information
 *     description: Get basic information about the Dine Sphere API and available endpoints
 *     responses:
 *       200:
 *         description: API information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Welcome to Dine Sphere API"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     auth:
 *                       type: string
 *                       example: "/api/auth"
 *                     users:
 *                       type: string
 *                       example: "/api/users"
 *                     restaurants:
 *                       type: string
 *                       example: "/api/restaurants"
 *                     reservations:
 *                       type: string
 *                       example: "/api/reservations"
 *                     menus:
 *                       type: string
 *                       example: "/api/menus"
 *                     docs:
 *                       type: string
 *                       example: "/api-docs"
 */

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Dine Sphere API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      restaurants: '/api/restaurants',
      reservations: '/api/reservations',
      menus: '/api/menus',
      docs: '/api-docs'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Dine Sphere Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});

export default app;
