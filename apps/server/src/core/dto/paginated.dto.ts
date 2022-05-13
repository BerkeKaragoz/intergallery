import { ApiProperty } from '@nestjs/swagger';

export abstract class APaginatedDTO {
  @ApiProperty()
  total: number;
  @ApiProperty()
  page: number;
  @ApiProperty()
  totalPages: number;
  @ApiProperty()
  perPage: number;

  constructor(total: number, page: number, perPage: number) {
    this.total = total;
    this.page = page;
    this.perPage = perPage;
    this.totalPages = Math.ceil(this.total / this.perPage); //TODO getter?
  }
}

export interface IPaginatedDTO<T> extends APaginatedDTO {
  data: T;
}

// This causes swagger type problems, prefer implementing the interface
export class PaginatedDTO<T> extends APaginatedDTO {
  data: T;

  constructor(data: T, total: number, page: number, perPage: number) {
    super(total, page, perPage);
    this.data = data;
  }
}
