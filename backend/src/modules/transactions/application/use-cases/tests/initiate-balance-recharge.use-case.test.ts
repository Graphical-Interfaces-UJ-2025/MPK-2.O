import 'reflect-metadata';
import { beforeEach, describe, it, vi } from 'vitest';
import { ILogger } from '../../../../shared/application/services/logger.interface';
import { IUserRepository } from '../../../../user/application/repositories/user.repository.interface';
import { User } from '../../../../user/domain/entities/user.entity';
import { ITransactionRepository } from '../../repositories/transaction.repository.interface';
import { InitiateBalanceRechargeUseCase } from '../initiate-balance-recharge.use-case';
import { IQueueService } from '../../../../shared/application/services/queue.interface';
import { TRANSACTION_EVENTS, TRANSACTION_ERRORS } from '../../../constants';

const createUserMock = () =>
  new User(
    '245235-2352352',
    '46346462',
    'test@mail.com',
    'password-hash',
    'password-salt',
    'Name',
    'lastName',
    0,
    'user',
    new Date(),
    new Date()
  );

const userRepositoryMock: IUserRepository = {
  findById: vi.fn(),
  findByPesel: vi.fn(),
  findByEmail: vi.fn(),
  create: vi.fn().mockResolvedValue(createUserMock()),
  update: vi.fn(),
  delete: vi.fn(),
  findAll: vi.fn(),
};

const transactionRepositoryMock: ITransactionRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
};

const queueServiceMock: IQueueService = {
  emit: vi.fn(),
  on: vi.fn(),
  once: vi.fn(),
  off: vi.fn(),
  removeAllListeners: vi.fn(),
};

const loggerMock: ILogger = {
  child: vi.fn().mockReturnThis(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
};

describe('InitiateBalanceRechargeUseCase', () => {
  let useCase: InitiateBalanceRechargeUseCase;

  beforeEach(() => {
    vi.clearAllMocks();

    useCase = new InitiateBalanceRechargeUseCase(
      userRepositoryMock,
      transactionRepositoryMock,
      queueServiceMock,
      loggerMock
    );
  });

  it('Fails if user does not exists', async ({ expect }) => {
    vi.mocked(userRepositoryMock.findById).mockResolvedValue(null);

    const response = useCase.execute('0aeb4ea5-a7ea-42cf-a2ae-4e073963fdca', 600);

    await expect(response).rejects.toThrow(TRANSACTION_ERRORS.USER_NOT_FOUND);
  });

  it('Fails if user tries to recharge with amount lower than 500 (5 zlotych)', async ({
    expect,
  }) => {
    vi.mocked(userRepositoryMock.findById).mockResolvedValue(createUserMock());
    const response = useCase.execute('0aeb4ea5-a7ea-42cf-a2ae-4e073963fdca', 300);

    await expect(response).rejects.toThrow(TRANSACTION_ERRORS.MINIMUM_RECHARGE_AMOUNT);
  });

  it('Balance recharge initiation succeeded', async ({ expect }) => {
    const rechargeAmount = 10000;
    const userId = '0aeb4ea5-a7ea-42cf-a2ae-4e073963fdca';
    vi.mocked(userRepositoryMock.findById).mockResolvedValue(createUserMock());

    await useCase.execute(userId, rechargeAmount);

    expect(transactionRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'RECHARGE',
        amount: rechargeAmount,
        status: 'PENDING',
        userId,
      })
    );

    expect(queueServiceMock.emit).toHaveBeenCalledWith(
      TRANSACTION_EVENTS.RECHARGE_INITIATED,
      expect.objectContaining({
        transactionId: expect.any(String),
      })
    );
  });
});
