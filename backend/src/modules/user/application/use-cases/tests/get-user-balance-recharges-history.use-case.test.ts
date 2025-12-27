import 'reflect-metadata';
import { beforeEach, describe, it, vi } from 'vitest';
import { ILogger } from '../../../../shared/application/services/logger.interface';
import { IUserRepository } from '../../repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { USER_ERRORS } from '../../../constants';
import { GetUserBalanceRechargesHistoryUseCase } from '../get-user-balance-recharges-history.use-case';
import { GetCurrentUserUseCase } from '../../../../auth/application/use-cases/get-current-user.use-case';
import { Pagination } from '../../../../shared/application/query/pagination.query';
import { IUserAccountRechargeRepository } from '../../repositories/user-account-recharge.repository.interface';
import { UserAccountRecharge } from '../../../domain/entities/user-account-recharge.entity';
import { PaginatedResult } from '../../../../shared/application/query/paginated-result.query';

const createUserMock = () =>
  new User(
    '245235-2352352',
    '46346462',
    'password-hash',
    'password-salt',
    'Name',
    'lastName',
    0,
    'user',
    new Date(),
    new Date()
  );

const createUserAccountRechargeMock = (overrides?: Partial<UserAccountRecharge>) =>
  new UserAccountRecharge(
    overrides?.transactionId ?? 'txn-123',
    overrides?.amount ?? 5000,
    overrides?.status ?? 'COMPLETED',
    overrides?.createdAt ?? new Date()
  );

const createPaginatedResultMock = (
  data: UserAccountRecharge[] = [],
  options?: { limit?: number; offset?: number; total?: number }
) =>
  new PaginatedResult(
    data,
    options?.limit ?? 20,
    options?.offset ?? 0,
    options?.total ?? data.length
  );

const userRepositoryMock: IUserRepository = {
  findById: vi.fn(),
  findByPesel: vi.fn(),
  create: vi.fn().mockResolvedValue(createUserMock()),
  update: vi.fn(),
  delete: vi.fn(),
  findAll: vi.fn(),
};

const userAccountRechargesRepositoryMock: IUserAccountRechargeRepository = {
  findByUserId: vi.fn(),
};

const loggerMock: ILogger = {
  child: vi.fn().mockReturnThis(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
};

const getCurrentUserUseCaseMock = {
  execute: vi.fn(),
} as unknown as GetCurrentUserUseCase;

describe('GetUserBalanceRechargesHistoryUseCase', () => {
  let useCase: GetUserBalanceRechargesHistoryUseCase;

  beforeEach(() => {
    vi.clearAllMocks();

    useCase = new GetUserBalanceRechargesHistoryUseCase(
      userRepositoryMock,
      userAccountRechargesRepositoryMock,
      getCurrentUserUseCaseMock,
      loggerMock
    );
  });

  it('Fails if user does not exists', async ({ expect }) => {
    vi.mocked(userRepositoryMock.findById).mockResolvedValue(null);

    const pagination = new Pagination(0, 20);

    const response = useCase.execute('0aeb4ea5-a7ea-42cf-a2ae-4e073963fdca', pagination);

    await expect(response).rejects.toThrow(USER_ERRORS.USER_NOT_FOUND);
  });

  it('Returns valid user balance recharges page', async ({ expect }) => {
    const recharges = [createUserAccountRechargeMock(), createUserAccountRechargeMock()];
    const paginatedResult = createPaginatedResultMock(recharges, { total: 50 });

    vi.mocked(userRepositoryMock.findById).mockResolvedValue(createUserMock());
    vi.mocked(userAccountRechargesRepositoryMock.findByUserId).mockResolvedValue(paginatedResult);

    const pagination = new Pagination(20, 0);

    const response = await useCase.execute('0aeb4ea5-a7ea-42cf-a2ae-4e073963fdca', pagination);

    expect(response).toMatchObject(
      expect.objectContaining({
        pageSize: 2,
        page: 1,
        hasNext: true,
        hasPrev: false,
        data: expect.any(Array),
      })
    );
  });

  it('Return empty array if offset is more than total', async ({ expect }) => {
    const paginatedResult = createPaginatedResultMock([], { offset: 100, total: 50 });

    vi.mocked(userRepositoryMock.findById).mockResolvedValue(createUserMock());
    vi.mocked(userAccountRechargesRepositoryMock.findByUserId).mockResolvedValue(paginatedResult);

    const pagination = new Pagination(20, 100);

    const response = await useCase.execute('0aeb4ea5-a7ea-42cf-a2ae-4e073963fdca', pagination);

    expect(response).toMatchObject(
      expect.objectContaining({
        data: [],
      })
    );
  });
});
