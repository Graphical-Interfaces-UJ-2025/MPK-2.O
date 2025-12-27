export type TransactionType = 'RECHARGE' | 'TICKET_PURCHASE' | 'TICKET_REFUND';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly type: TransactionType,
    public readonly amount: number,
    public readonly ticketId: string | null,
    public readonly status: TransactionStatus,
    public readonly createdAt: Date
  ) {}

  static create(
    id: string,
    userId: string,
    type: TransactionType,
    amount: number,
    ticketId: string | null = null,
    status: TransactionStatus = 'PENDING'
  ): Transaction {
    return new Transaction(id, userId, type, amount, ticketId, status, new Date());
  }

  complete(): Transaction {
    return new Transaction(
      this.id,
      this.userId,
      this.type,
      this.amount,
      this.ticketId,
      'COMPLETED',
      this.createdAt
    );
  }

  fail(): Transaction {
    return new Transaction(
      this.id,
      this.userId,
      this.type,
      this.amount,
      this.ticketId,
      'FAILED',
      this.createdAt
    );
  }
}
