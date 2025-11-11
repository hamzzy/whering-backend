import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
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
  getApiInfo() {
    const port = this.configService.get('app.port') || 3000;
    return {
      name: 'Digital Wardrobe API',
      version: '1.0',
      address: `http://localhost:${port}/api`,
    };
  }

  @Get('health')
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
