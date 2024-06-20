export interface IResponsePagination {
  success: boolean;
  message: string;
  totalCount: number;
  perPage: number;
  totalPages: number;
  currentPage: number;
  next: string | null;
  prev: string | null;
}