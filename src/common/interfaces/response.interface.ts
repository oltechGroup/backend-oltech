export interface IResponse<T> {
  success: boolean;
  message: string;
  errorMessage: string;
  error: any;
  data: T;
}