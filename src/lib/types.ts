export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type PaginatedDTO<T = never> = {
  total: number;
  page: number;
  totalPages: number;
  perPage: number;
  data: T[];
};
