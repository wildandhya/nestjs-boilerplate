export const HTTP_MESSAGES = {
    200: 'Operation successful',
    201: 'Resource created successfully',
    400: 'Bad Request - Invalid parameters provided',
    401: 'Unauthorized - Authentication required',
    403: 'Forbidden - Insufficient permissions',
    404: 'Not Found - Resource not found',
    409: 'Conflict - Resource already exists',
    422: 'Unprocessable Entity - Validation failed',
    429: 'Too Many Requests - Please try again later',
    500: 'Internal Server Error - Something went wrong',
    503: 'Service Unavailable - Please try again later'
  } as const;
  
  export type HttpStatusCode = keyof typeof HTTP_MESSAGES;