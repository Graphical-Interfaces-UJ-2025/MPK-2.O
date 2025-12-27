import { Transaction } from '../entities/transaction.entity';
import {
  TransactionRecord,
  NewTransactionRecord,
} from '../../infrastructure/database/models/transaction.model';

export class TransactionMapper {
  static toDomain(record: TransactionRecord): Transaction {
    return new Transaction(
      record.id,
      record.userId,
      record.type,
      parseFloat(record.amount),
      record.ticketId,
      record.status,
      record.createdAt
    );
  }

  static toPersistence(transaction: Transaction): NewTransactionRecord {
    return {
      id: transaction.id,
      userId: transaction.userId,
      type: transaction.type,
      amount: transaction.amount.toString(),
      ticketId: transaction.ticketId,
      status: transaction.status,
      createdAt: transaction.createdAt,
    };
  }
}
