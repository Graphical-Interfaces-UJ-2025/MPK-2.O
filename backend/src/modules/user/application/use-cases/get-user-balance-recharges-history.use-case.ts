import { inject, injectable } from 'tsyringe';
import { IUserRepository, IUserRepositoryToken } from '../repositories/user.repository.interface';
import { UserAccountRecharge } from '../../domain/entities/user-account-recharge.entity';
import { Pagination } from '../../../shared/application/query/pagination.query';
import { PaginatedResult } from '../../../shared/application/query/paginated-result.query';
import { GetCurrentUserUseCase } from '../../../auth/application/use-cases/get-current-user.use-case';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import {
  IUserAccountRechargeRepository,
  IUserAccountRechargeRepositoryToken,
} from '../repositories/user-account-recharge.repository.interface';
import { USER_ERRORS } from '../../constants';

@injectable()
export class GetUserBalanceRechargesHistoryUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(IUserRepositoryToken) private readonly userRepository: IUserRepository,
    @inject(IUserAccountRechargeRepositoryToken)
    private readonly userAccountRechargesRepository: IUserAccountRechargeRepository,
    @inject(GetCurrentUserUseCase) private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child('GetUserBalanceRechargesHistoryUseCase');
  }

  public async execute(
    userId: string,
    pagination: Pagination
  ): Promise<PaginatedResult<UserAccountRecharge>> {
    this.logger.info('Fetching user balance recharges history', { userId });

    const user = await this.userRepository.findById(userId);
    if (!user) {
      this.logger.warn('User not found', { userId });
      throw new Error(USER_ERRORS.USER_NOT_FOUND);
    }

    const result = await this.userAccountRechargesRepository.findByUserId(userId, pagination);

    this.logger.info('User balance recharges history fetched successfully', {
      userId,
      total: result.total,
      page: result.page,
    });

    return result;
  }
}
