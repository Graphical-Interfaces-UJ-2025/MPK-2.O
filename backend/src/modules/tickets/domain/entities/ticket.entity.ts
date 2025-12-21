export class Ticket {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
    public readonly currentPrice?: number
  ) {}

  get isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  static create(id: string, name: string): Ticket {
    return new Ticket(id, name, new Date(), new Date(), null);
  }
}
