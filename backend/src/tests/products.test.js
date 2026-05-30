
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

describe('Products API', () => {
  let authToken;
  let testProductId;

  beforeAll(async () => {
    authToken = 'test-token';
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        name: 'Test Product',
        price: 99.99,
        stock: 100,
        categoryId: 'test-category-id',
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newProduct);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      
      if (response.body.data) {
        testProductId = response.body.data.id;
      }
    });

    it('should return 400 for invalid product data', async () => {
      const invalidProduct = {
        name: '',
        price: -10,
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidProduct);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update an existing product', async () => {
      if (!testProductId) {
        console.log('Skipping update test - no test product');
        return;
      }

      const updateData = {
        name: 'Updated Test Product',
        price: 89.99,
      };

      const response = await request(app)
        .put(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete an existing product', async () => {
      if (!testProductId) {
        console.log('Skipping delete test - no test product');
        return;
      }

      const response = await request(app)
        .delete(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });
  });
});