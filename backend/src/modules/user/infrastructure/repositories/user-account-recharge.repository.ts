import { injectable } from 'tsyringe';
import { eq, and, count, desc } from 'drizzle-orm';
import { IUserAccountRechargeRepository } from '../../application/repositories/user-account-recharge.repository.interface';
import { UserAccountRecharge } from '../../domain/entities/user-account-recharge.entity';
import { UserAccountRechargeMapper } from '../../domain/mappers/user-account-recharge.mapper';
import { Pagination } from '../../../shared/application/query/pagination.query';
import { PaginatedResult } from '../../../shared/application/query/paginated-result.query';
import { transactions } from '../../../../config/database/schema';
import { db } from '../../../../config/database.config';

@injectable()
export class UserAccountRechargeRepository implements IUserAccountRechargeRepository {
  async findByUserId(
    userId: string,
    pagination: Pagination
  ): Promise<PaginatedResult<UserAccountRecharge>> {
    const whereCondition = and(eq(transactions.userId, userId), eq(transactions.type, 'RECHARGE'));

    const [totalResult] = await db
      .select({ count: count() })
      .from(transactions)
      .where(whereCondition);

    const records = await db
      .select()
      .from(transactions)
      .where(whereCondition)
      .orderBy(desc(transactions.createdAt))
      .limit(pagination.limit)
      .offset(pagination.offset);

    const data = records.map(UserAccountRechargeMapper.toDomain);

    return new PaginatedResult(data, pagination.limit, pagination.offset, totalResult.count);
  }
}
