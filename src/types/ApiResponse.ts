export interface ApiResponse {
  success: boolean;
  status: number;
  message: string;
}

export interface ApiDataResponse<T> extends ApiResponse {
  data: T;
}
