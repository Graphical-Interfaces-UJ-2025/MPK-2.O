import 'reflect-metadata';
import { container } from 'tsyringe';

import { ILoggerToken } from '../modules/shared/application/services/logger.interface';
import { WinstonLogger } from '../modules/shared/infrastructure/services/winston-logger.service';

import { IUserRepositoryToken } from '../modules/auth/application/repositories/user.repository.interface';
import { UserRepository } from '../modules/auth/infrastructure/repositories/user.repository';
import { IAuthServiceToken } from '../modules/auth/application/services/auth.service.interface';
import { AuthService } from '../modules/auth/infrastructure/services/auth.service';

// ===========================
// Shared Module Registrations
// ===========================

container.register(ILoggerToken, {
  useClass: WinstonLogger,
});

container.register(IUserRepositoryToken, {
  useClass: UserRepository,
});

// ===========================
// Auth Module Registrations
// ===========================

container.register(IAuthServiceToken, {
  useClass: AuthService,
});

export { container };
