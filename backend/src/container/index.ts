import 'reflect-metadata';
import { container } from 'tsyringe';

import { ILoggerToken } from '../modules/shared/application/services/logger.interface';
import { WinstonLogger } from '../modules/shared/infrastructure/services/winston-logger.service';
import { IQueueServiceToken } from '../modules/shared/application/services/queue.interface';
import { InMemoryQueueService } from '../modules/shared/infrastructure/services/in-memory-queue.service';

import { IUserRepositoryToken } from '../modules/user/application/repositories/user.repository.interface';
import { UserRepository } from '../modules/user/infrastructure/repositories/user.repository';
import { IUserAccountRechargeRepositoryToken } from '../modules/user/application/repositories/user-account-recharge.repository.interface';
import { UserAccountRechargeRepository } from '../modules/user/infrastructure/repositories/user-account-recharge.repository';
import { IAuthServiceToken } from '../modules/auth/application/services/auth.service.interface';
import { AuthService } from '../modules/auth/infrastructure/services/auth.service';

import { ITicketRepositoryToken } from '../modules/tickets/application/repositories/ticket.repository.interface';
import { TicketRepository } from '../modules/tickets/infrastructure/repositories/ticket.repository';
import { ITicketPriceRepositoryToken } from '../modules/tickets/application/repositories/ticket-price.repository.interface';
import { TicketPriceRepository } from '../modules/tickets/infrastructure/repositories/ticket-price.repository';
import { ITicketOrderRepositoryToken } from '../modules/tickets/application/repositories/ticket-order.repository.interface';
import { TicketOrderRepository } from '../modules/tickets/infrastructure/repositories/ticket-order.repository';
import { PurchaseTicketUseCase } from '../modules/tickets/application/use-cases/purchase-ticket.use-case';
import { GetUserTicketOrdersHistoryUseCase } from '../modules/tickets/application/use-cases/get-user-ticket-orders-history.use-case';
import { RegisterUserUseCase } from '../modules/auth/application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../modules/auth/application/use-cases/login-user.use-case';
import { GetCurrentUserUseCase } from '../modules/auth/application/use-cases/get-current-user.use-case';

import { ITransactionRepositoryToken } from '../modules/transactions/application/repositories/transaction.repository.interface';
import { TransactionRepository } from '../modules/transactions/infrastructure/repositories/transaction.repository';
import { InitiateBalanceRechargeUseCase } from '../modules/transactions/application/use-cases/initiate-balance-recharge.use-case';
import { ProceedBalanceRechargeUseCase } from '../modules/transactions/application/use-cases/proceed-balance-recharge.use-case';

import { IStationRepositoryToken } from '../modules/station/application/repositories';
import { StationRepository } from '../modules/station/infrastructure/repositories';
import {
  CreateStationUseCase,
  GetStationUseCase,
  GetStationsUseCase,
  UpdateStationUseCase,
  DeleteStationUseCase,
} from '../modules/station/application/use-cases';

import { ITransportRepositoryToken } from '../modules/transport/application/repositories';
import { TransportRepository } from '../modules/transport/infrastructure/repositories';
import {
  CreateTransportUseCase,
  GetTransportUseCase,
  GetTransportsUseCase,
  UpdateTransportUseCase,
  DeleteTransportUseCase,
} from '../modules/transport/application/use-cases';

// ===========================
// Shared Module Registrations
// ===========================

container.registerSingleton(ILoggerToken, WinstonLogger);

container.registerSingleton(IQueueServiceToken, InMemoryQueueService);

container.register(IUserRepositoryToken, {
  useClass: UserRepository,
});

container.register(IUserAccountRechargeRepositoryToken, {
  useClass: UserAccountRechargeRepository,
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

container.register(PurchaseTicketUseCase, {
  useClass: PurchaseTicketUseCase,
});

container.register(GetUserTicketOrdersHistoryUseCase, {
  useClass: GetUserTicketOrdersHistoryUseCase,
});

// ===========================
// Transactions Module Registrations
// ===========================

container.register(ITransactionRepositoryToken, {
  useClass: TransactionRepository,
});

container.register(InitiateBalanceRechargeUseCase, {
  useClass: InitiateBalanceRechargeUseCase,
});

container.register(ProceedBalanceRechargeUseCase, {
  useClass: ProceedBalanceRechargeUseCase,
});

// ===========================
// Station Module Registrations
// ===========================

container.registerSingleton(IStationRepositoryToken, StationRepository);

container.register(CreateStationUseCase, {
  useClass: CreateStationUseCase,
});

container.register(GetStationUseCase, {
  useClass: GetStationUseCase,
});

container.register(GetStationsUseCase, {
  useClass: GetStationsUseCase,
});

container.register(UpdateStationUseCase, {
  useClass: UpdateStationUseCase,
});

container.register(DeleteStationUseCase, {
  useClass: DeleteStationUseCase,
});

// ===========================
// Transport Module Registrations
// ===========================

container.registerSingleton(ITransportRepositoryToken, TransportRepository);

container.register(CreateTransportUseCase, {
  useClass: CreateTransportUseCase,
});

container.register(GetTransportUseCase, {
  useClass: GetTransportUseCase,
});

container.register(GetTransportsUseCase, {
  useClass: GetTransportsUseCase,
});

container.register(UpdateTransportUseCase, {
  useClass: UpdateTransportUseCase,
});

container.register(DeleteTransportUseCase, {
  useClass: DeleteTransportUseCase,
});

export { container };
