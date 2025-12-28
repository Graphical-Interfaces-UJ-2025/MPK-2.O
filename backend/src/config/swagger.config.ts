import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Integrated Public Transport Management API',
      version: '1.0.0',
      description: 'API for managing public transport ticketing system',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'integer', description: 'Total number of items' },
            page: { type: 'integer', description: 'Current page number' },
            pageSize: { type: 'integer', description: 'Number of items on current page' },
            hasNext: { type: 'boolean', description: 'Whether there is a next page' },
            hasPrev: { type: 'boolean', description: 'Whether there is a previous page' },
          },
        },
        TicketOrderResponse: {
          type: 'object',
          properties: {
            ticketId: { type: 'string', format: 'uuid' },
            ticketName: { type: 'string' },
            validFrom: { type: 'string', format: 'date-time' },
            validTo: { type: 'string', format: 'date-time' },
            orderedAt: { type: 'string', format: 'date-time' },
            price: { type: 'integer', description: 'Price in grosze' },
            concessionId: { type: 'integer' },
          },
        },
        TicketOrdersHistoryResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/TicketOrderResponse' },
            },
            pagination: { $ref: '#/components/schemas/Pagination' },
          },
        },
        BalanceRechargeResponse: {
          type: 'object',
          properties: {
            transactionId: { type: 'string', format: 'uuid' },
            amount: { type: 'integer', description: 'Amount in grosze' },
            status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'FAILED'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        BalanceRechargesHistoryResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/BalanceRechargeResponse' },
            },
            pagination: { $ref: '#/components/schemas/Pagination' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
        // Auth schemas
        RegisterRequest: {
          type: 'object',
          required: ['pesel', 'password', 'firstName', 'lastName'],
          properties: {
            pesel: {
              type: 'string',
              description: 'Polish national identification number (11 digits)',
            },
            password: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['pesel', 'password'],
          properties: {
            pesel: {
              type: 'string',
              description: 'Polish national identification number (11 digits)',
            },
            password: { type: 'string' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string' },
              },
            },
          },
        },
        UserResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                pesel: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                role: { type: 'string', enum: ['user', 'admin', 'application_manager'] },
              },
            },
          },
        },
        // Ticket schemas
        Ticket: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            price: { type: 'integer', description: 'Price in grosze' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            deletedAt: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        TicketListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Ticket' },
            },
          },
        },
        TicketResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { $ref: '#/components/schemas/Ticket' },
          },
        },
        CreateTicketRequest: {
          type: 'object',
          required: ['name', 'price'],
          properties: {
            name: { type: 'string' },
            price: { type: 'integer', description: 'Price in grosze' },
          },
        },
        PurchaseTicketRequest: {
          type: 'object',
          required: ['ticketId', 'validFrom', 'validTo', 'concessionId'],
          properties: {
            ticketId: { type: 'string', format: 'uuid' },
            validFrom: { type: 'string', format: 'date-time' },
            validTo: { type: 'string', format: 'date-time' },
            concessionId: { type: 'integer' },
          },
        },
        PurchaseTicketResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { $ref: '#/components/schemas/TicketOrderResponse' },
          },
        },
        // Transaction schemas
        RechargeRequest: {
          type: 'object',
          required: ['amount'],
          properties: {
            amount: {
              type: 'integer',
              description: 'Amount to recharge in grosze (minimum 5000 = 50 PLN)',
            },
          },
        },
        RechargeInitiatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
        SuccessMessageResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/infrastructure/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
