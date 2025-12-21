export class TicketOrder {
  constructor(
    public readonly userId: string,
    public readonly ticketId: string,
    public readonly validFrom: Date,
    public readonly validTo: Date,
    public readonly concessionId: number,
    public readonly orderedAt: Date,
    public readonly price: number | null,
    public readonly ticketName?: string
  ) {}
}
