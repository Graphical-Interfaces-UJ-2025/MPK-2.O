import { Transaction } from '../../domain/entities/transaction.entity';

export interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findByUserId(userId: string): Promise<Transaction[]>;
  create(transaction: Transaction): Promise<Transaction>;
  update(transaction: Transaction): Promise<Transaction>;
}

export const ITransactionRepositoryToken = Symbol('ITransactionRepository');
