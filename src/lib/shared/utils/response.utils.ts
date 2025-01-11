import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ApiResponse, MetaData } from '../dto/api-response.dto';
import { HTTP_MESSAGES, HttpStatusCode } from '../../constants/http-message.constant';
import { ValidationError } from 'class-validator';

export class ResponseUtil {
  private static readonly logger = new Logger('ResponseUtil');

  static success<T>(
    data: T, 
    message?: string, 
    statusCode: number = HttpStatus.OK,
    metaData?: MetaData
  ): ApiResponse<T> {
    return new ApiResponse(
      true,
      message || HTTP_MESSAGES[statusCode as HttpStatusCode] || HTTP_MESSAGES[200],
      data,
      statusCode
    );
  }

  static error<T>(
    error: Error|  ValidationError  | HttpException | string,
    data?: T ,
    statusCode: number = HttpStatus.BAD_REQUEST
  ): ApiResponse<T> {
    let errorMessage: string;
    let errorStatus: number = statusCode;

    if (error instanceof HttpException) {
      errorStatus = error.getStatus();
      const response = error.getResponse();
      
      // Handle validation error response format
      if (typeof response === 'object' && 'message' in response) {
        // Check if message is an array (validation errors)
        errorMessage = Array.isArray(response.message) 
          ? response.message.join(', ')
          : response.message as string;
      } else {
        // Fallback to error message or string response
        errorMessage = error.message || String(response);
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = error.toString();
    }

    // Log the error for debugging
    this.logger.error(errorMessage);
    return new ApiResponse(
      false,
      errorMessage || HTTP_MESSAGES[errorStatus as HttpStatusCode] || HTTP_MESSAGES[500],
      data || null,
      errorStatus,
      HTTP_MESSAGES[errorStatus as HttpStatusCode]
    );
  }

  static paginate<T>(
    data: T[],
    page: number,
    size: number,
    totalData: number,
    message?: string
  ): ApiResponse<T[]> {
    const totalPage = Math.ceil(totalData / size);
    const metaData: MetaData = {
      page,
      size,
      totalPage,
      totalData,
    };
    return new ApiResponse(
      true,
      message || HTTP_MESSAGES[200],
      data,
      HttpStatus.OK,
      null,
      metaData
    );
  }
}