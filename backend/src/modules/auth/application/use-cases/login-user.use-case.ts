import { inject, injectable } from 'tsyringe';
import { IUserRepository, IUserRepositoryToken } from '../repositories/user.repository.interface';
import { IAuthService, IAuthServiceToken } from '../services/auth.service.interface';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { User } from '../../domain/entities/user.entity';
import { LoginUserDto } from '../dto/login-user.dto';

export interface LoginResult {
  user: User;
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
    this.logger.info('Attempting to login user', { email: dto.email });

    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      this.logger.warn('Login failed: User not found', { email: dto.email });
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await this.authService.comparePassword(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      this.logger.warn('Login failed: Invalid password', { email: dto.email });
      throw new Error('Invalid email or password');
    }

    const token = this.authService.generateToken(user.id);

    this.logger.info('User logged in successfully', {
      userId: user.id,
      email: user.email,
    });

    return { user, token };
  }
}
