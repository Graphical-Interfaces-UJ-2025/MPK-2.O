import 'reflect-metadata';
import { beforeEach, describe, it, vi } from 'vitest';
import { ILogger } from '../../../../shared/application/services/logger.interface';
import { IUserRepository } from '../../../../user/application/repositories/user.repository.interface';
import { IAuthService } from '../../services/auth.service.interface';
import { RegisterUserUseCase } from '../register-user.use-case';
import { User } from '../../../../user/domain/entities/user.entity';
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
  create: vi.fn().mockResolvedValue(createUserMock()),
  update: vi.fn(),
  delete: vi.fn(),
  findAll: vi.fn(),
};

const authServiceMock: IAuthService = {
  hashPassword: vi.fn().mockResolvedValue({
    hash: 'hashed-password',
    salt: 'salt',
  }),
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

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;

  beforeEach(() => {
    vi.clearAllMocks();

    useCase = new RegisterUserUseCase(userRepositoryMock, authServiceMock, loggerMock);
  });

  it('Creates new user if no user with this pesel is registered', async ({ expect }) => {
    vi.mocked(userRepositoryMock.findByPesel).mockResolvedValue(null);

    const response = await useCase.execute({
      pesel: '35235235123',
      password: 'password',
      firstName: 'Name',
      lastName: 'LastName',
    });

    expect(userRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({ pesel: '35235235123' })
    );

    expect(authServiceMock.hashPassword).toHaveBeenCalledWith('password');

    expect(authServiceMock.generateToken).toHaveBeenCalledWith(expect.any(String));

    expect(response).toMatchObject({
      token: expect.any(String),
    });
  });

  it('Fails when user with this pesel already exists', async ({ expect }) => {
    vi.mocked(userRepositoryMock.findByPesel).mockResolvedValue(createUserMock());

    const response = useCase.execute({
      pesel: '35235235123',
      password: 'password',
      firstName: 'Name',
      lastName: 'LastName',
    });

    await expect(response).rejects.toThrow(AUTH_ERRORS.USER_ALREADY_EXISTS);
  });
});
