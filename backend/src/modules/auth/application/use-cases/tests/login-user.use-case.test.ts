import 'reflect-metadata';
import { beforeEach, describe, it, vi } from 'vitest';
import { User } from '../../../../user/domain/entities/user.entity';
import { IAuthService } from '../../services/auth.service.interface';
import { ILogger } from '../../../../shared/application/services/logger.interface';
import { LoginUserUseCase } from '../login-user.use-case';
import { IUserRepository } from '../../../../user/application/repositories/user.repository.interface';
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

const authServiceMock: IAuthService = {
  hashPassword: vi.fn(),
  comparePassword: vi.fn(),
  generateToken: vi.fn().mockReturnValue('token'),
  verifyToken: vi.fn(),
};

const loggerMock: ILogger = {
  child: vi.fn().mockReturnThis(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
};

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;

  beforeEach(() => {
    vi.clearAllMocks();

    useCase = new LoginUserUseCase(userRepositoryMock, authServiceMock, loggerMock);
  });

  it('Successful user login', async ({ expect }) => {
    vi.mocked(userRepositoryMock.findByPesel).mockResolvedValue(createUserMock());
    vi.mocked(authServiceMock.comparePassword).mockResolvedValue(true);

    const response = await useCase.execute({
      pesel: '12354646',
      password: '523523523',
    });

    expect(response).toMatchObject({
      token: expect.any(String),
    });
  });

  it('Invalid password provided by user', async ({ expect }) => {
    vi.mocked(userRepositoryMock.findByPesel).mockResolvedValue(createUserMock());
    vi.mocked(authServiceMock.comparePassword).mockResolvedValue(false);

    const response = useCase.execute({
      pesel: '12354646',
      password: '523523523',
    });

    await expect(response).rejects.toThrow(AUTH_ERRORS.INVALID_CREDENTIALS);
  });

  it('Login to non existing account', async ({ expect }) => {
    vi.mocked(userRepositoryMock.findByPesel).mockResolvedValue(null);
    vi.mocked(authServiceMock.comparePassword).mockResolvedValue(true);

    const response = useCase.execute({
      pesel: '12354646',
      password: '523523523',
    });

    await expect(response).rejects.toThrow(AUTH_ERRORS.INVALID_CREDENTIALS);
  });
});
