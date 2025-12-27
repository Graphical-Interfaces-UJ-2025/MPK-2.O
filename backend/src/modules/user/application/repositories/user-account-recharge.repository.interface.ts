import { UserAccountRecharge } from '../../domain/entities/user-account-recharge.entity';
import { Pagination } from '../../../shared/application/query/pagination.query';
import { PaginatedResult } from '../../../shared/application/query/paginated-result.query';

export interface IUserAccountRechargeRepository {
  findByUserId(
    userId: string,
    pagination: Pagination
  ): Promise<PaginatedResult<UserAccountRecharge>>;
}

export const IUserAccountRechargeRepositoryToken = Symbol('IUserAccountRechargeRepository');
