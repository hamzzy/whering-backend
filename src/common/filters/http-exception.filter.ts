import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Enhanced 404 error message
    if (status === 404) {
      const baseUrl = `${request.protocol}://${request.get('host')}`;
      const apiBase = `${baseUrl}/api/v1`;

      const errorResponse: any = {
        statusCode: 404,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        message: 'The requested resource was not found.',
        error: 'Not Found',
      };

      // Add helpful suggestions in development
      if (process.env.NODE_ENV !== 'production') {
        errorResponse.suggestions = {
          availableEndpoints: [
            `GET ${apiBase} - Get API information`,
            `GET ${apiBase}/health - Health check`,
            `GET ${apiBase}/items - List all items`,
            `POST ${apiBase}/items - Create an item`,
            `GET ${apiBase}/items/:id - Get item by ID`,
            `PATCH ${apiBase}/items/:id - Update an item`,
            `DELETE ${apiBase}/items/:id - Delete an item`,
          ],
          documentation: `${baseUrl}/api/docs`,
          note: 'All API endpoints are prefixed with /api/v1',
        };

        // Check if user might be looking for Swagger docs
        if (request.url.includes('docs') || request.url === '/docs') {
          errorResponse.suggestions.hint = `Swagger documentation is available at ${baseUrl}/api/docs`;
        }
      }

      return response.status(404).json(errorResponse);
    }

    // Standard error response for other HTTP exceptions
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
      error: exception.name,
    });
  }
}
