import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, ApiOkResponse, getSchemaPath, ApiQuery } from '@nestjs/swagger';
import { ApiResponse as CustomApiResponse } from '../shared/dto/api-response.dto';
import { HTTP_MESSAGES } from '../constants/http-message.constant';

export interface PaginationApiOptions {
    sortFields?: string[];
    filterFields?: string[];
}

interface ApiResponseOptions {
    type?: Type<any> | [Type<any>];
    isArray?: boolean;
    code?: number
    message?: string;
}

function createResponseSchema(options: ApiResponseOptions = {}) {
    const { type, isArray = false, message, code } = options;

    if (!code) {
        return {
            allOf: [
                { $ref: getSchemaPath(CustomApiResponse) },
            ]
        };
    }
    // error
    if (code > 399) {
        return {
            type: "object",
            properties: {
                success: { type: "boolean", example: false },
                statusCode: { type: "number", example: code },
                message: { type: "string", example: message || HTTP_MESSAGES[code] },
                data: {}
            }
        }
    }

    if(!type){
        return {
            type: "object",
            properties: {
                success: { type: "boolean", example: true },
                statusCode: { type: "number", example: code },
                message: { type: "string", example: message || HTTP_MESSAGES[code] },
                data: {}
            }
        }
    }

    if (!isArray) {
        return {
            type: "object",
            properties: {
                success: { type: "boolean", example: true },
                statusCode: { type: "number", example: code },
                message: { type: "string", example: message || HTTP_MESSAGES[code] },
                data: { $ref: getSchemaPath(Array.isArray(type) ? type[0] : type) }
            }
        }
    }


    return {
        type: 'object',
        properties: {
            success: { type: "boolean", example: true },
            statusCode: { type: "number", example: code },
            message: { type: "string", example: message || HTTP_MESSAGES[code] },
            data: {
                type: 'array',
                items: { $ref: getSchemaPath(Array.isArray(type) ? type[0] : type) }
            },
            metaData: {
                type: 'object',
                properties: {
                    page: { type: 'number' },
                    size: { type: 'number' },
                    totalPage: { type: 'number' },
                    totalData: { type: 'number' }
                }
            }
        }
    }
}

/**
 * Common API responses decorator with dynamic data type
 * @param options Configuration options for the response
 */
export function ApiCommonResponse(options: ApiResponseOptions = {}) {
    const { type, isArray, message } = options;

    return applyDecorators(
        ApiOkResponse({
            description: message || 'Operation successful',
            schema: createResponseSchema({ type, message, isArray, code: 200 })
        }),
        ApiResponse({
            status: 400,
            description: HTTP_MESSAGES[400],
            schema: createResponseSchema({ code: 400 })
        }),
        ApiResponse({
            status: 401,
            description: HTTP_MESSAGES[401],
            schema: createResponseSchema({ code: 401 })
        }),
        ApiResponse({
            status: 500,
            description: HTTP_MESSAGES[500],
            schema: createResponseSchema({ code: 500 })
        })
    );
}

export function ApiPaginationQueries(options?: PaginationApiOptions) {
    const { sortFields = [], filterFields = [] } = options || {};

    return applyDecorators(
        ApiQuery({
            name: 'page',
            required: false,
            type: 'number',
            description: 'Page number for pagination (starts from 1)',
            example: 1
        }),
        ApiQuery({
            name: 'limit',
            required: false,
            type: 'number',
            description: 'Number of items per page',
            example: 10
        }),
        ApiQuery({
            name: 'sort',
            required: false,
            type: 'string',
            description: 'Sorting criteria (format: field:value)',
            example: sortFields.length ? `${sortFields[0]}:asc` : undefined,
        }),
        ApiQuery({
            name: 'filter',
            required: false,
            type: 'string',
            description: 'Filter criteria (format: field:query:value)',
            example: filterFields.length ? `${filterFields[0]}:like:jhon` : undefined,
        })
    );
}

/**
 * Combines common responses and pagination queries with dynamic response type
 */
export function ApiPaginatedResponses(
    responseOptions: ApiResponseOptions,
    paginationOptions?: PaginationApiOptions
) {
    return applyDecorators(
        ApiCommonResponse(responseOptions),
        ApiPaginationQueries(paginationOptions)
    );
}