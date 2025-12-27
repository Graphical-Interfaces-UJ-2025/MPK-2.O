import { inject, injectable } from 'tsyringe';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../user/application/repositories/user.repository.interface';
import { IAuthService, IAuthServiceToken } from '../services/auth.service.interface';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { LoginUserDto } from '../dto/login-user.dto';
import { AUTH_ERRORS } from '../../constants';

export interface LoginResult {
  token: string;
}

@injectable()
export class LoginUserUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(IUserRepositoryToken) private userRepository: IUserRepository,
    @inject(IAuthServiceToken) private authService: IAuthService,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child('LoginUserUseCase');
  }

  async execute(dto: LoginUserDto): Promise<LoginResult> {
    this.logger.info('Attempting to login user', { pesel: dto.pesel });

    const user = await this.userRepository.findByPesel(dto.pesel);
    if (!user) {
      this.logger.warn('Login failed: User not found', { pesel: dto.pesel });
      throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await this.authService.comparePassword(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      this.logger.warn('Login failed: Invalid password', { pesel: dto.pesel });
      throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    const token = this.authService.generateToken(user.id);

    this.logger.info('User logged in successfully', {
      userId: user.id,
      pesel: user.pesel,
    });

    return { token };
  }
}
