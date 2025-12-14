import { inject, injectable } from 'tsyringe';
import { IUserRepository, IUserRepositoryToken } from '../repositories/user.repository.interface';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { User } from '../../domain/entities/user.entity';

@injectable()
export class GetCurrentUserUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(IUserRepositoryToken) private userRepository: IUserRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child('GetCurrentUserUseCase');
  }

  async execute(userId: string): Promise<User> {
    this.logger.info('Attempting to get current user', { userId });

    const user = await this.userRepository.findById(userId);
    if (!user) {
      this.logger.warn('User not found', { userId });
      throw new Error('User not found');
    }

    this.logger.info('User retrieved successfully', {
      userId: user.id,
      pesel: user.pesel,
    });

    return user;
  }
}
