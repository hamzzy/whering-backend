import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ItemCategory } from '../src/modules/items/entities/item.entity';

describe('ItemsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /items', () => {
    it('should create a new item', () => {
      const createItemDto = {
        category: ItemCategory.TOPS,
        colour: 'blue',
        user_id: 'user-123',
        brand: 'Brooks Brothers',
        size: 'M',
        image_url: 'https://example.com/shirt.jpg',
        purchase_date: '2024-01-15',
        purchase_price: 89.99,
      };

      return request(app.getHttpServer())
        .post('/v1/items')
        .send(createItemDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.category).toBe(ItemCategory.TOPS);
          expect(res.body.colour).toBe('blue');
          expect(res.body.user_id).toBe('user-123');
          expect(res.body.brand).toBe('Brooks Brothers');
          expect(res.body.size).toBe('M');
          expect(res.body.image_url).toBe('https://example.com/shirt.jpg');
          expect(res.body.purchase_price).toBe(89.99);
        });
    });

    it('should return 400 for invalid data', () => {
      const invalidDto = {
        category: 'invalid',
        colour: '',
      };

      return request(app.getHttpServer())
        .post('/v1/items')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('GET /items', () => {
    it('should return all items with pagination', () => {
      return request(app.getHttpServer())
        .get('/v1/items')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('count');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should filter by user_id', () => {
      return request(app.getHttpServer())
        .get('/v1/items?user_id=user-123')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('count');
        });
    });

    it('should filter by category', () => {
      return request(app.getHttpServer())
        .get(`/v1/items?category=${ItemCategory.TOPS}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('count');
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('/v1/items?limit=10&offset=0')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('count');
        });
    });

    it('should support sorting', () => {
      return request(app.getHttpServer())
        .get('/v1/items?sort_by=purchase_date&sort_order=desc')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('count');
        });
    });
  });

  describe('GET /items/:id', () => {
    let createdItemId: string;

    beforeAll(async () => {
      const createItemDto = {
        category: ItemCategory.TOPS,
        colour: 'red',
        user_id: 'user-456',
        brand: 'Nike',
        size: 'L',
        image_url: 'https://example.com/shirt2.jpg',
        purchase_date: '2024-02-01',
        purchase_price: 49.99,
      };

      const response = await request(app.getHttpServer())
        .post('/v1/items')
        .send(createItemDto)
        .expect(201);

      createdItemId = response.body.id;
    });

    it('should return a single item', () => {
      return request(app.getHttpServer())
        .get(`/v1/items/${createdItemId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdItemId);
          expect(res.body).toHaveProperty('category');
          expect(res.body).toHaveProperty('colour');
        });
    });

    it('should return 404 for non-existent item', () => {
      return request(app.getHttpServer())
        .get('/v1/items/non-existent-id')
        .expect(404);
    });
  });

  describe('PATCH /items/:id', () => {
    let createdItemId: string;

    beforeAll(async () => {
      const createItemDto = {
        category: ItemCategory.BOTTOMS,
        colour: 'black',
        user_id: 'user-789',
        brand: "Levi's",
        size: '32',
        image_url: 'https://example.com/jeans.jpg',
        purchase_date: '2024-03-01',
        purchase_price: 79.99,
      };

      const response = await request(app.getHttpServer())
        .post('/v1/items')
        .send(createItemDto)
        .expect(201);

      createdItemId = response.body.id;
    });

    it('should update an item', () => {
      const updateDto = {
        colour: 'navy',
        purchase_price: 89.99,
      };

      return request(app.getHttpServer())
        .patch(`/v1/items/${createdItemId}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.colour).toBe('navy');
          expect(res.body.purchase_price).toBe(89.99);
        });
    });

    it('should return 404 for non-existent item', () => {
      return request(app.getHttpServer())
        .patch('/v1/items/non-existent-id')
        .send({ colour: 'red' })
        .expect(404);
    });
  });

  describe('DELETE /items/:id', () => {
    let createdItemId: string;

    beforeAll(async () => {
      const createItemDto = {
        category: ItemCategory.SHOES,
        colour: 'brown',
        user_id: 'user-999',
        brand: 'Clarks',
        size: '10',
        image_url: 'https://example.com/shoes.jpg',
        purchase_date: '2024-04-01',
        purchase_price: 129.99,
      };

      const response = await request(app.getHttpServer())
        .post('/v1/items')
        .send(createItemDto)
        .expect(201);

      createdItemId = response.body.id;
    });

    it('should delete an item', () => {
      return request(app.getHttpServer())
        .delete(`/v1/items/${createdItemId}`)
        .expect(204);
    });

    it('should return 404 for non-existent item', () => {
      return request(app.getHttpServer())
        .delete('/v1/items/non-existent-id')
        .expect(404);
    });
  });
});
