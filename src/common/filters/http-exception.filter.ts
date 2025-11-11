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

    // Clean 404 error message - no stack traces, no suggestions
    if (status === 404) {
      return response.status(404).json({
        statusCode: 404,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: 'The requested resource was not found.',
      });
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
