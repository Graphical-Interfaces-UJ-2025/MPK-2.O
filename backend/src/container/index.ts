import 'reflect-metadata';
import { container } from 'tsyringe';

import { ILoggerToken } from '../modules/shared/application/services/logger.interface';
import { WinstonLogger } from '../modules/shared/infrastructure/services/winston-logger.service';

import { IUserRepositoryToken } from '../modules/auth/application/repositories/user.repository.interface';
import { UserRepository } from '../modules/auth/infrastructure/repositories/user.repository';
import { IAuthServiceToken } from '../modules/auth/application/services/auth.service.interface';
import { AuthService } from '../modules/auth/infrastructure/services/auth.service';

import { ITicketRepositoryToken } from '../modules/tickets/application/repositories/ticket.repository.interface';
import { TicketRepository } from '../modules/tickets/infrastructure/repositories/ticket.repository';
import { ITicketPriceRepositoryToken } from '../modules/tickets/application/repositories/ticket-price.repository.interface';
import { TicketPriceRepository } from '../modules/tickets/infrastructure/repositories/ticket-price.repository';
import { ITicketOrderRepositoryToken } from '../modules/tickets/application/repositories/ticket-order.repository.interface';
import { TicketOrderRepository } from '../modules/tickets/infrastructure/repositories/ticket-order.repository';
import { RegisterUserUseCase } from '../modules/auth/application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../modules/auth/application/use-cases/login-user.use-case';
import { GetCurrentUserUseCase } from '../modules/auth/application/use-cases/get-current-user.use-case';

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

container.register(RegisterUserUseCase, {
  useClass: RegisterUserUseCase,
});

container.register(LoginUserUseCase, {
  useClass: LoginUserUseCase,
});

container.register(GetCurrentUserUseCase, {
  useClass: GetCurrentUserUseCase,
});

// ===========================
// Tickets Module Registrations
// ===========================

container.register(ITicketRepositoryToken, {
  useClass: TicketRepository,
});

container.register(ITicketPriceRepositoryToken, {
  useClass: TicketPriceRepository,
});

container.register(ITicketOrderRepositoryToken, {
  useClass: TicketOrderRepository,
});

export { container };
