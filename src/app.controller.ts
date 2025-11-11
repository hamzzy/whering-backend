import { Controller, Get, Version, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('health')
@Controller()
export class AppController {
  @Get()
  @Version('1')
  @ApiOperation({ summary: 'Get API information' })
  @ApiOkResponse({
    description: 'API address and version',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Digital Wardrobe API' },
        version: { type: 'string', example: '1.0' },
        address: { type: 'string', example: 'http://localhost:3000/api' },
      },
    },
  })
  getApiInfo(@Req() request: Request) {
    // Handle reverse proxy (X-Forwarded-* headers)
    const protocol =
      request.get('x-forwarded-proto')?.split(',')[0]?.trim() ||
      request.protocol ||
      'http';
    const host =
      request.get('x-forwarded-host')?.split(',')[0]?.trim() ||
      request.get('host') ||
      'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    return {
      name: 'Digital Wardrobe API',
      version: '1.0',
      address: `${baseUrl}/api`,
    };
  }

  @Get('health')
  @Version('1')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiOkResponse({
    description: 'Health status',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: {
          type: 'string',
          example: '2024-01-15T00:00:00.000Z',
        },
      },
    },
  })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
