import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { Request } from 'express';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API information', () => {
      const mockRequest = {
        protocol: 'http',
        get: jest.fn((header: string) => {
          if (header === 'host') return 'localhost:3000';
          return undefined;
        }),
      } as unknown as Request;

      const result = appController.getApiInfo(mockRequest);
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('address');
      expect(result.address).toBe('http://localhost:3000/api');
    });

    it('should use request host in production', () => {
      const mockRequest = {
        protocol: 'https',
        get: jest.fn((header: string) => {
          if (header === 'host') return 'api.example.com';
          return undefined;
        }),
      } as unknown as Request;

      const result = appController.getApiInfo(mockRequest);
      expect(result.address).toBe('https://api.example.com/api');
    });
  });
});
