import { inject, injectable } from 'tsyringe';
import { IUserRepository, IUserRepositoryToken } from '../repositories/user.repository.interface';
import { IAuthService, IAuthServiceToken } from '../services/auth.service.interface';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { User } from '../../domain/entities/user.entity';

@injectable()
export class GetCurrentUserUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(IUserRepositoryToken) private userRepository: IUserRepository,
    @inject(IAuthServiceToken) private authService: IAuthService,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child('GetCurrentUserUseCase');
  }

  async execute(token: string): Promise<User> {
    this.logger.info('Attempting to get current user from token');

    const payload = this.authService.verifyToken(token);
    if (!payload) {
      this.logger.warn('Invalid or expired token');
      throw new Error('Invalid or expired token');
    }

    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      this.logger.warn('User not found', { userId: payload.userId });
      throw new Error('User not found');
    }

    this.logger.info('User retrieved successfully', {
      userId: user.id,
      email: user.email,
    });

    return user;
  }
}
