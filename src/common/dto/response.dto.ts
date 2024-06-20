import { IResponsePagination } from '../interfaces/responsePagination.interface';
import { IResponse } from '../interfaces/response.interface';

export class ResponseSuccess<T> implements IResponse<T> {
  constructor(message: string, data: T) {
    this.success = true;
    this.message = message;
    this.errorMessage = null;
    this.error = null;
    this.data = data;
  }
  public readonly success: boolean;
  public readonly errorMessage: string;
  public readonly error: any;
  public readonly message: string;
  public readonly data: T;
}

export class ResponseError implements IResponse<null> {
  constructor(message: string, error: any) {
    this.success = false;
    this.message = null;
    this.errorMessage = message;
    this.error = error;
    this.data = null;
  }
  public readonly success: boolean;
  public readonly errorMessage: string;
  public readonly error: any;
  public readonly message: string;
  public readonly data: null;
}

export class ResponsePagination<T> {
  constructor(
    public readonly info: IResponsePagination,
    public readonly data: T[]
  ) {}
}