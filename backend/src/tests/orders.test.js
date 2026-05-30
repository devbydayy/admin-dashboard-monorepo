const request = require('supertest');
const { app } = require('../app');
const { prisma } = require('../db/prisma');

jest.mock('../middleware/auth.middleware', () => ({
  __esModule: true,
  default: (req, res, next) => {
    req.user = { id: 'test-user-id', role: 'ADMIN' };
    next();
  },
}));

describe('Orders API', () => {
  let authToken;

  beforeAll(async () => {
    authToken = 'test-token';
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/orders', () => {
    it('should return all orders', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .get('/api/orders/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      const newOrder = {
        customerId: 'test-customer-id',
        items: [
          { productId: 'test-product-id', quantity: 2, price: 29.99 },
        ],
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newOrder);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should return 400 for invalid order data', async () => {
      const invalidOrder = {
        customerId: '',
        items: [],
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidOrder);

      expect(response.status).toBe(400);
    });
  });
});