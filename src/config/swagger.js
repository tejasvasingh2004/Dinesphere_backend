import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger options
const options = {
  definition: {
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
    consumes: ['multipart/form-data'],
    produces: ['application/json'],
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
        bearerAuth: {
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
              type: 'string',
              format: 'uuid',
              description: 'User UUID'
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
              description: 'User role ID (1=admin, 2=manager, 3=customer)'
            },
            is_active: {
              type: 'boolean',
              description: 'User active status'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Restaurant: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Restaurant UUID'
            },
            owner_id: {
              type: 'string',
              format: 'uuid',
              description: 'Owner user UUID'
            },
            name: {
              type: 'string',
              description: 'Restaurant name'
            },
            description: {
              type: 'string',
              description: 'Restaurant description'
            },
            website: {
              type: 'string',
              description: 'Restaurant website URL'
            },
            cuisine: {
              type: 'string',
              description: 'Type of cuisine'
            },
            rating: {
              type: 'number',
              format: 'float',
              description: 'Restaurant rating'
            },
            price_range: {
              type: 'string',
              description: 'Price range (e.g., "₹2500-10000")'
            },
            location: {
              type: 'string',
              description: 'Restaurant location'
            },
            image: {
              type: 'string',
              description: 'Restaurant image URL'
            },
            open_time: {
              type: 'string',
              description: 'Opening hours'
            },
            available_slots: {
              type: 'integer',
              description: 'Number of available booking slots'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        CreateRestaurantRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            owner_id: {
              type: 'string',
              format: 'uuid',
              description: 'Owner user UUID'
            },
            name: {
              type: 'string',
              description: 'Restaurant name'
            },
            description: {
              type: 'string',
              description: 'Restaurant description'
            },
            website: {
              type: 'string',
              description: 'Restaurant website URL'
            },
            cuisine: {
              type: 'string',
              description: 'Type of cuisine'
            },
            rating: {
              type: 'number',
              format: 'float',
              description: 'Restaurant rating'
            },
            price_range: {
              type: 'string',
              description: 'Price range'
            },
            location: {
              type: 'string',
              description: 'Restaurant location'
            },
            image: {
              type: 'string',
              description: 'Restaurant image URL'
            },
            open_time: {
              type: 'string',
              description: 'Opening hours'
            },
            available_slots: {
              type: 'integer',
              description: 'Number of available booking slots'
            }
          }
        },
        Reservation: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Reservation UUID'
            },
            restaurant_id: {
              type: 'string',
              format: 'uuid',
              description: 'Restaurant UUID'
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'User UUID'
            },
            party_size: {
              type: 'integer',
              description: 'Number of guests'
            },
            status: {
              type: 'string',
              description: 'Reservation status',
              enum: ['pending', 'confirmed', 'cancelled', 'completed'],
              default: 'pending'
            },
            reservation_start: {
              type: 'string',
              format: 'date-time',
              description: 'Reservation start time'
            },
            reservation_end: {
              type: 'string',
              format: 'date-time',
              description: 'Reservation end time'
            },
            special_requests: {
              type: 'string',
              description: 'Special requests or notes'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        CreateReservationRequest: {
          type: 'object',
          required: ['restaurant_id', 'user_id', 'party_size', 'reservation_start'],
          properties: {
            restaurant_id: {
              type: 'string',
              format: 'uuid',
              description: 'Restaurant UUID'
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'User UUID'
            },
            party_size: {
              type: 'integer',
              description: 'Number of guests',
              minimum: 1
            },
            status: {
              type: 'string',
              description: 'Reservation status',
              enum: ['pending', 'confirmed', 'cancelled', 'completed'],
              default: 'pending'
            },
            reservation_start: {
              type: 'string',
              format: 'date-time',
              description: 'Reservation start time'
            },
            reservation_end: {
              type: 'string',
              format: 'date-time',
              description: 'Reservation end time'
            },
            special_requests: {
              type: 'string',
              description: 'Special requests or notes'
            }
          }
        },
        UpdateReservationRequest: {
          type: 'object',
          properties: {
            restaurant_id: {
              type: 'string',
              format: 'uuid',
              description: 'Restaurant UUID'
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'User UUID'
            },
            party_size: {
              type: 'integer',
              description: 'Number of guests',
              minimum: 1
            },
            status: {
              type: 'string',
              description: 'Reservation status',
              enum: ['pending', 'confirmed', 'cancelled', 'completed']
            },
            reservation_start: {
              type: 'string',
              format: 'date-time',
              description: 'Reservation start time'
            },
            reservation_end: {
              type: 'string',
              format: 'date-time',
              description: 'Reservation end time'
            },
            special_requests: {
              type: 'string',
              description: 'Special requests or notes'
            }
          }
        },
        ReservationResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              $ref: '#/components/schemas/Reservation'
            },
            message: {
              type: 'string',
              example: 'Reservation fetched'
            }
          }
        },
        ReservationsListResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Reservation'
              }
            },
            message: {
              type: 'string',
              example: 'Reservations fetched'
            }
          }
        },
        UpdateRestaurantRequest: {
          type: 'object',
          properties: {
            owner_id: {
              type: 'string',
              format: 'uuid',
              description: 'Owner user UUID'
            },
            name: {
              type: 'string',
              description: 'Restaurant name'
            },
            description: {
              type: 'string',
              description: 'Restaurant description'
            },
            website: {
              type: 'string',
              description: 'Restaurant website URL'
            },
            cuisine: {
              type: 'string',
              description: 'Type of cuisine'
            },
            rating: {
              type: 'number',
              format: 'float',
              description: 'Restaurant rating'
            },
            price_range: {
              type: 'string',
              description: 'Price range'
            },
            location: {
              type: 'string',
              description: 'Restaurant location'
            },
            image: {
              type: 'string',
              description: 'Restaurant image URL'
            },
            open_time: {
              type: 'string',
              description: 'Opening hours'
            },
            available_slots: {
              type: 'integer',
              description: 'Number of available booking slots'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js']
};

// Generate docs
const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
