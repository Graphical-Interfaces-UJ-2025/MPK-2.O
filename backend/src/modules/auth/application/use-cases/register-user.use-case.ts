import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { IUserRepository, IUserRepositoryToken } from '../repositories/user.repository.interface';
import { IAuthService, IAuthServiceToken } from '../services/auth.service.interface';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { User } from '../../domain/entities/user.entity';
import { RegisterUserDto } from '../dto/register-user.dto';

@injectable()
export class RegisterUserUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(IUserRepositoryToken) private userRepository: IUserRepository,
    @inject(IAuthServiceToken) private authService: IAuthService,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child('RegisterUserUseCase');
  }

  async execute(dto: RegisterUserDto): Promise<User> {
    this.logger.info('Attempting to register new user', { email: dto.email });

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      this.logger.warn('Registration failed: User already exists', { email: dto.email });
      throw new Error('User with this email already exists');
    }

    const passwordHash = await this.authService.hashPassword(dto.password);

    const user = User.create(uuidv4(), dto.email, passwordHash, dto.firstName, dto.lastName);

    const createdUser = await this.userRepository.create(user);

    this.logger.info('User registered successfully', {
      userId: createdUser.id,
      email: createdUser.email,
    });

    return createdUser;
  }
}
