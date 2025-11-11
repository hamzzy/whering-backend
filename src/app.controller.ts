import { Controller, Get, Version } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  @Get()
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
