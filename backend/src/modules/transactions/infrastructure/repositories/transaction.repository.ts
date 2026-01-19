import { injectable } from 'tsyringe';
import { eq, desc } from 'drizzle-orm';
import { ITransactionRepository } from '../../application/repositories/transaction.repository.interface';
import { Transaction } from '../../domain/entities/transaction.entity';
import { transactions } from '../database/models/transaction.model';
import { TransactionMapper } from '../../domain/mappers/transaction.mapper';
import { db } from '../../../../config/database.config';

@injectable()
export class TransactionRepository implements ITransactionRepository {
  async findById(id: string): Promise<Transaction | null> {
    const [record] = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1);
    return record ? TransactionMapper.toDomain(record) : null;
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    const records = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
    return records.map(TransactionMapper.toDomain);
  }

  async create(transaction: Transaction): Promise<Transaction> {
    const data = TransactionMapper.toPersistence(transaction);
    const [record] = await db.insert(transactions).values(data).returning();
    return TransactionMapper.toDomain(record);
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const data = TransactionMapper.toPersistence(transaction);
    const [record] = await db
      .update(transactions)
      .set(data)
      .where(eq(transactions.id, transaction.id))
      .returning();
    return TransactionMapper.toDomain(record);
  }
}
