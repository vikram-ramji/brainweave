export interface ApiResponse<T = any> {
  success: boolean;
  status: number;
  message: string;
}

export interface ApiDataResponse<T> extends ApiResponse<T> {
  data: T;
}
