import 'reflect-metadata';
import { beforeEach, describe, it, vi } from 'vitest';
import { User } from '../../../../user/domain/entities/user.entity';
import { ILogger } from '../../../../shared/application/services/logger.interface';
import { IUserRepository } from '../../../../user/application/repositories/user.repository.interface';
import { GetCurrentUserUseCase } from '../get-current-user.use-case';
import { AUTH_ERRORS } from '../../../constants';

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

const userRepositoryMock: IUserRepository = {
  findById: vi.fn(),
  findByPesel: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findAll: vi.fn(),
};

const loggerMock: ILogger = {
  child: vi.fn().mockReturnThis(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
};

describe('GetCurrentUserUseCase', () => {
  let useCase: GetCurrentUserUseCase;

  beforeEach(() => {
    vi.clearAllMocks();

    useCase = new GetCurrentUserUseCase(userRepositoryMock, loggerMock);
  });

  it('Successful user retrieval', async ({ expect }) => {
    vi.mocked(userRepositoryMock.findById).mockResolvedValue(createUserMock());

    const response = await useCase.execute('4523-c235232-c235');

    expect(response).toMatchObject({
      pesel: expect.any(String),
    });
  });

  it('Unsuccessful user retrieval', async ({ expect }) => {
    vi.mocked(userRepositoryMock.findById).mockResolvedValue(null);

    const response = useCase.execute('4523-c235232-c235');

    await expect(response).rejects.toThrow(AUTH_ERRORS.USER_NOT_FOUND);
  });
});
