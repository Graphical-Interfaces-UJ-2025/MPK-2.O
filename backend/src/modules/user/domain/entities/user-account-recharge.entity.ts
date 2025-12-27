import { TransactionStatus } from '../../../transactions/domain/entities/transaction.entity';

export class UserAccountRecharge {
  constructor(
    public readonly transactionId: string,
    public readonly amount: number,
    public readonly status: TransactionStatus,
    public readonly createdAt: Date
  ) {}
}
