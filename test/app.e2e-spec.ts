import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, VersioningType } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter());
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/v1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('version');
        expect(res.body).toHaveProperty('address');
      });
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status', 'ok');
        expect(res.body).toHaveProperty('timestamp');
      });
  });

  it('/non-existent (GET) - should return enhanced 404', async () => {
    // Set NODE_ENV to development for this test to get suggestions
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const response = await request(app.getHttpServer())
      .get('/api/v1/non-existent')
      .expect(404);

    expect(response.body).toHaveProperty('statusCode', 404);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('path');
    expect(response.body).toHaveProperty('error', 'Not Found');
    // Suggestions only in non-production
    expect(response.body).toHaveProperty('suggestions');
    expect(response.body.suggestions).toHaveProperty('availableEndpoints');
    expect(Array.isArray(response.body.suggestions.availableEndpoints)).toBe(
      true,
    );
    expect(response.body.suggestions).toHaveProperty('documentation');
    expect(response.body.suggestions).toHaveProperty('note');

    // Restore original env
    process.env.NODE_ENV = originalEnv;
  });
});
