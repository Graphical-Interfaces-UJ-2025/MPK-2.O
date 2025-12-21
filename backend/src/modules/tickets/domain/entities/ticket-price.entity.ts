export class TicketPrice {
  constructor(
    public readonly id: number,
    public readonly ticketId: string,
    public readonly price: number,
    public readonly validFrom: Date,
    public readonly validTo: Date | null
  ) {}

  static create(ticketId: string, price: number): TicketPrice {
    return new TicketPrice(0, ticketId, price, new Date(), null);
  }

  get isCurrent(): boolean {
    const now = new Date();
    return this.validFrom <= now && (this.validTo === null || this.validTo > now);
  }
}
