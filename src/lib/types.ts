export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type PaginatedDTO<T = void> = {
  total: number;
  page: number;
  totalPages: number;
  perPage: number;
} & (T extends void
  ? {}
  : {
      data: T[];
    });
