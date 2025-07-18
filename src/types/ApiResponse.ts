export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Inherit from ApiResponse for success cases
export interface ApiSuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
}

// Inherit from ApiResponse for error cases
export interface ApiErrorResponse extends ApiResponse<never> {
  success: false;
}
