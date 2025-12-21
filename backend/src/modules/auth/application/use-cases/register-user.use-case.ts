import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { IUserRepository, IUserRepositoryToken } from '../repositories/user.repository.interface';
import { IAuthService, IAuthServiceToken } from '../services/auth.service.interface';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { User } from '../../domain/entities/user.entity';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginResult } from './login-user.use-case';

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

  async execute(dto: RegisterUserDto): Promise<LoginResult> {
    this.logger.info('Attempting to register new user', { pesel: dto.pesel });

    const existingUser = await this.userRepository.findByPesel(dto.pesel);
    if (existingUser) {
      this.logger.warn('Registration failed: User already exists', { pesel: dto.pesel });
      throw new Error('User with this PESEL already exists');
    }

    const { hash: passwordHash, salt: passwordSalt } = await this.authService.hashPassword(
      dto.password
    );

    const user = User.create(
      uuidv4(),
      dto.pesel,
      passwordHash,
      passwordSalt,
      dto.firstName,
      dto.lastName
    );

    const createdUser = await this.userRepository.create(user);

    this.logger.info('User registered successfully', {
      userId: createdUser.id,
      pesel: createdUser.pesel,
    });

    const token = this.authService.generateToken(user.id);

    return { token };
  }
}
