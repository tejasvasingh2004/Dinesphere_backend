import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Dine Sphere API',
    version: '1.0.0',
    description: 'A comprehensive restaurant management system API with user authentication, restaurant management, reservations, and menu management.',
    contact: {
      name: 'Dine Sphere Support',
      email: 'support@dinesphere.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server'
    },
    {
      url: 'https://api.dinesphere.com',
      description: 'Production server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Authorization header using the Bearer scheme. Enter your token in the text input below.'
      },
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'API Key authentication'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'User ID'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          full_name: {
            type: 'string',
            description: 'User full name'
          },
          phone: {
            type: 'string',
            description: 'User phone number'
          },
          role_id: {
            type: 'integer',
            description: 'User role ID (1=admin, 2=user)'
          },
          is_active: {
            type: 'boolean',
            description: 'User active status'
          }
        }
      },
      Restaurant: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Restaurant ID'
          },
          name: {
            type: 'string',
            description: 'Restaurant name'
          },
          description: {
            type: 'string',
            description: 'Restaurant description'
          },
          address: {
            type: 'string',
            description: 'Restaurant address'
          },
          phone: {
            type: 'string',
            description: 'Restaurant phone number'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Restaurant email'
          },
          cuisine_type: {
            type: 'string',
            description: 'Type of cuisine'
          },
          rating: {
            type: 'number',
            format: 'float',
            description: 'Restaurant rating'
          },
          is_active: {
            type: 'boolean',
            description: 'Restaurant active status'
          }
        }
      },
      Reservation: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Reservation ID'
          },
          user_id: {
            type: 'integer',
            description: 'User ID who made the reservation'
          },
          restaurant_id: {
            type: 'integer',
            description: 'Restaurant ID'
          },
          reservation_date: {
            type: 'string',
            format: 'date-time',
            description: 'Reservation date and time'
          },
          party_size: {
            type: 'integer',
            description: 'Number of people in the party'
          },
          status: {
            type: 'string',
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            description: 'Reservation status'
          },
          special_requests: {
            type: 'string',
            description: 'Special requests or notes'
          }
        }
      },
      MenuItem: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Menu item ID'
          },
          restaurant_id: {
            type: 'integer',
            description: 'Restaurant ID'
          },
          name: {
            type: 'string',
            description: 'Menu item name'
          },
          description: {
            type: 'string',
            description: 'Menu item description'
          },
          price: {
            type: 'number',
            format: 'float',
            description: 'Menu item price'
          },
          category: {
            type: 'string',
            description: 'Menu item category'
          },
          is_available: {
            type: 'boolean',
            description: 'Menu item availability'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            description: 'Error message'
          },
          error: {
            type: 'string',
            description: 'Error details'
          }
        }
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Response success status'
          },
          message: {
            type: 'string',
            description: 'Response message'
          },
          data: {
            type: 'object',
            description: 'Response data'
          }
        }
      }
    }
  },
  security: [
    {
      BearerAuth: []
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: [
    './src/routes/authRoutes.js',
    './src/routes/userRoutes.js',
    './src/routes/restaurantRoutes.js',
    './src/routes/reservationRoutes.js',
    './src/routes/menuRoutes.js',
    './server.js'
  ]
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
