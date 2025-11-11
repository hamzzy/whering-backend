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

  it('/api/v1 (GET) - should return health check', () => {
    return request(app.getHttpServer())
      .get('/api/v1')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status', 'ok');
        expect(res.body).toHaveProperty('timestamp');
      });
  });

  it('/non-existent (GET) - should return clean 404 without stack trace', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/non-existent')
      .expect(404);

    expect(response.body).toHaveProperty('statusCode', 404);
    expect(response.body).toHaveProperty(
      'message',
      'The requested resource was not found.',
    );
    expect(response.body).toHaveProperty('path', '/api/v1/non-existent');
    expect(response.body).toHaveProperty('timestamp');
    // No stack trace in response
    expect(response.body).not.toHaveProperty('stack');
  });
});
