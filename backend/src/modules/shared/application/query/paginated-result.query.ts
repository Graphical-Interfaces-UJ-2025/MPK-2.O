export class PaginatedResult<T> {
  constructor(
    public readonly data: T[],
    private readonly limit: number,
    private readonly offset: number,
    public readonly total: number
  ) {}

  get hasNext() {
    return this.offset + 2 * this.limit <= this.total;
  }

  get hasPrev() {
    return this.offset - this.limit >= 0;
  }

  get page() {
    return this.offset / this.limit + 1;
  }

  get pageSize() {
    return this.data.length;
  }
}
