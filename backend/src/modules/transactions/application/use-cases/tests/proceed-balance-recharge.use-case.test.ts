import 'reflect-metadata';
import { beforeEach, describe, it, vi } from 'vitest';
import { ILogger } from '../../../../shared/application/services/logger.interface';
import { ITransactionRepository } from '../../repositories/transaction.repository.interface';
import { IUserRepository } from '../../../../user/application/repositories/user.repository.interface';
import { ProceedBalanceRechargeUseCase } from '../proceed-balance-recharge.use-case';
import { Transaction, TransactionStatus } from '../../../domain/entities/transaction.entity';
import { User } from '../../../../user/domain/entities/user.entity';
import { TRANSACTION_ERRORS } from '../../../constants';

const transactionRepositoryMock: ITransactionRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
};

const userRepositoryMock: IUserRepository = {
  findById: vi.fn(),
  findByPesel: vi.fn(),
  findByEmail: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findAll: vi.fn(),
};

const createTransactionMock = (status: TransactionStatus = 'COMPLETED') =>
  new Transaction(
    'd2fd0dcb-332e-4ad9-9808-26b4f5bf1b27',
    'c9e224a2-57dc-4775-8ce5-3440354bbfe7',
    'RECHARGE',
    6000,
    '741b2785-c9ae-4ca0-8c45-a1139f56d0df',
    status,
    new Date()
  );

const createUserMock = (balance: number = 10000) =>
  new User(
    'c9e224a2-57dc-4775-8ce5-3440354bbfe7',
    '12345678901',
    'test@mail.com',
    'password-hash',
    'password-salt',
    'John',
    'Doe',
    balance,
    'user',
    new Date(),
    new Date()
  );

const loggerMock: ILogger = {
  child: vi.fn().mockReturnThis(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
};

const mockTransactionId = 'd2fd0dcb-332e-4ad9-9808-26b4f5bf1b27';

describe('ProceedBalanceRechargeUseCase', () => {
  let useCase: ProceedBalanceRechargeUseCase;

  beforeEach(() => {
    vi.clearAllMocks();

    useCase = new ProceedBalanceRechargeUseCase(
      transactionRepositoryMock,
      userRepositoryMock,
      loggerMock
    );
  });

  it('Fails if transaction does not exists', async ({ expect }) => {
    vi.mocked(transactionRepositoryMock.findById).mockResolvedValue(null);

    const response = useCase.execute(mockTransactionId);

    await expect(response).rejects.toThrow(TRANSACTION_ERRORS.TRANSACTION_NOT_FOUND);
  });

  it('Fails if transaction already completed', async ({ expect }) => {
    vi.mocked(transactionRepositoryMock.findById).mockResolvedValue(
      createTransactionMock('COMPLETED')
    );

    const response = useCase.execute(mockTransactionId);

    await expect(response).rejects.toThrow(TRANSACTION_ERRORS.TRANSACTION_IS_ALREADY_COMPLETED);
  });

  it('Fails if transaction is failed', async ({ expect }) => {
    vi.mocked(transactionRepositoryMock.findById).mockResolvedValue(
      createTransactionMock('FAILED')
    );

    const response = useCase.execute(mockTransactionId);

    await expect(response).rejects.toThrow(TRANSACTION_ERRORS.TRANSACTION_FAILED);
  });

  it('Balance recharge succeeds', async ({ expect }) => {
    vi.mocked(transactionRepositoryMock.findById).mockResolvedValue(
      createTransactionMock('PENDING')
    );
    vi.mocked(userRepositoryMock.findById).mockResolvedValue(createUserMock(10000));

    await useCase.execute(mockTransactionId);

    expect(userRepositoryMock.update).toBeCalledWith(
      expect.objectContaining({
        balance: 16000,
      })
    );
    expect(transactionRepositoryMock.update).toBeCalledWith(
      expect.objectContaining({
        status: 'COMPLETED',
      })
    );
  });
});
