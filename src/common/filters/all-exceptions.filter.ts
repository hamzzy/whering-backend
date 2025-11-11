import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? typeof exception.getResponse() === 'string'
          ? exception.getResponse()
          : (exception.getResponse() as any)?.message || exception.message
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    // Log unexpected errors (server-side only, never expose stack to client)
    if (!(exception instanceof HttpException)) {
      console.error('Unhandled exception:', {
        error: exception,
        stack: exception instanceof Error ? exception.stack : undefined,
        path: request.url,
        method: request.method,
      });
    }

    // Clean error response - no stack traces ever (production-ready)
    const errorResponse: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        status === 404 ? 'The requested resource was not found.' : message,
    };

    // Never include stack traces in response - log server-side only
    response.status(status).json(errorResponse);
  }
}
