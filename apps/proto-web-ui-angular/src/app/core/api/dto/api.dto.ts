export interface PaginatedDTO<T> {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: T;
}

export default PaginatedDTO;
