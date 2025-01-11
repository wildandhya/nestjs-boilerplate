import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../shared/dto/api-response.dto';
import { ResponseUtil } from '../shared/utils/response.utils';
  
  @Injectable()
  export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
      return next.handle().pipe(
        map(data => {
          const statusCode = context.switchToHttp().getResponse().statusCode;
          
          if (data instanceof ApiResponse) {
            return data;
          }
  
          let metaData;
          let responseData = data;
  
          // Check if the response contains pagination metadata
          if (data && typeof data === 'object' && 'data' in data) {
            if ('page' in data || 'size' in data || 'totalPage' in data || 'totalData' in data) {
              metaData = {
                page: data.page,
                size: data.size,
                totalPage: data.totalPage,
                totalData: data.totalData,
              };
              responseData = data.data;
            }
          }
  
          // return ResponseUtil.success(responseData, undefined, statusCode, metaData);
          return data
        }),
        catchError(error => {
          const statusCode = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
          throw new HttpException(
            ResponseUtil.error(error, undefined, statusCode),
            statusCode
          );
        })
      );
    }
  }
  