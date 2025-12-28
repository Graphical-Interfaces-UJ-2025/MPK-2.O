import { Pagination } from './pagination.query';

export class PaginatedResult<T> {
  constructor(
    public readonly data: T[],
    public readonly pagination: Pagination,
    public readonly total: number
  ) {}

  get hasNext() {
    return this.pagination.offset + 2 * this.pagination.limit <= this.total;
  }

  get hasPrev() {
    return this.pagination.offset - this.pagination.limit >= 0;
  }

  get page() {
    return this.pagination.offset / this.pagination.limit + 1;
  }

  get pageSize() {
    return this.data.length;
  }
}
