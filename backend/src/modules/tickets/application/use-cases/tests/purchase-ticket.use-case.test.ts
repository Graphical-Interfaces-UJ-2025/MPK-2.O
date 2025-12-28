import 'reflect-metadata';
import { beforeEach, describe, it, vi } from 'vitest';
import { ILogger } from '../../../../shared/application/services/logger.interface';
import { IUserRepository } from '../../../../user/application/repositories/user.repository.interface';
import { User } from '../../../../user/domain/entities/user.entity';
import { ITicketRepository } from '../../repositories/ticket.repository.interface';
import { ITicketOrderRepository } from '../../repositories/ticket-order.repository.interface';
import { PurchaseTicketUseCase, PurchaseTicketInput } from '../purchase-ticket.use-case';
import { Ticket } from '../../../domain/entities/ticket.entity';
import { TicketOrder } from '../../../domain/entities/ticket-order.entity';
import { TICKET_ERRORS } from '../../../constants';

const createUserMock = (balance: number = 10000) =>
  new User(
    'user-123',
    '12345678901',
    'password-hash',
    'password-salt',
    'John',
    'Doe',
    balance,
    'user',
    new Date(),
    new Date()
  );

const createTicketMock = (price: number = 500) =>
  new Ticket('ticket-123', 'Monthly Pass', new Date(), new Date(), null, price);

const createTicketOrderMock = () =>
  new TicketOrder(
    'user-123',
    'ticket-123',
    new Date(),
    new Date(),
    1,
    new Date(),
    500,
    'Monthly Pass'
  );

const userRepositoryMock: IUserRepository = {
  findById: vi.fn(),
  findByPesel: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findAll: vi.fn(),
};

const ticketRepositoryMock: ITicketRepository = {
  findById: vi.fn(),
  findByIdIncludeDeleted: vi.fn(),
  findAll: vi.fn(),
  findAllIncludeDeleted: vi.fn(),
  create: vi.fn(),
  softDelete: vi.fn(),
};

const ticketOrderRepositoryMock: ITicketOrderRepository = {
  findByUserId: vi.fn(),
  findByUserIdPaginated: vi.fn(),
  create: vi.fn(),
};

const loggerMock: ILogger = {
  child: vi.fn().mockReturnThis(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
};

describe('PurchaseTicketUseCase', () => {
  let useCase: PurchaseTicketUseCase;

  beforeEach(() => {
    vi.clearAllMocks();

    useCase = new PurchaseTicketUseCase(
      userRepositoryMock,
      ticketRepositoryMock,
      ticketOrderRepositoryMock,
      loggerMock
    );
  });

  const createInput = (): PurchaseTicketInput => ({
    userId: 'user-123',
    ticketId: 'ticket-123',
    validFrom: new Date(),
    validTo: new Date(),
    concessionId: 1,
  });

  it('Fails if user does not exist', async ({ expect }) => {
    vi.mocked(userRepositoryMock.findById).mockResolvedValue(null);

    const response = useCase.execute(createInput());

    await expect(response).rejects.toThrow(TICKET_ERRORS.USER_NOT_FOUND);
    expect(ticketRepositoryMock.findById).not.toHaveBeenCalled();
  });

  it('Fails if ticket does not exist', async ({ expect }) => {
    vi.mocked(userRepositoryMock.findById).mockResolvedValue(createUserMock());
    vi.mocked(ticketRepositoryMock.findById).mockResolvedValue(null);

    const response = useCase.execute(createInput());

    await expect(response).rejects.toThrow(TICKET_ERRORS.TICKET_NOT_FOUND);
  });

  it('Fails if user has insufficient balance', async ({ expect }) => {
    vi.mocked(userRepositoryMock.findById).mockResolvedValue(createUserMock(100));
    vi.mocked(ticketRepositoryMock.findById).mockResolvedValue(createTicketMock(500));

    const response = useCase.execute(createInput());

    await expect(response).rejects.toThrow(TICKET_ERRORS.INSUFFICIENT_BALANCE);
    expect(ticketOrderRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('Successfully purchases ticket and deducts balance', async ({ expect }) => {
    const initialBalance = 10000;
    const ticketPrice = 500;
    const user = createUserMock(initialBalance);
    const ticket = createTicketMock(ticketPrice);
    const order = createTicketOrderMock();

    vi.mocked(userRepositoryMock.findById).mockResolvedValue(user);
    vi.mocked(ticketRepositoryMock.findById).mockResolvedValue(ticket);
    vi.mocked(ticketOrderRepositoryMock.create).mockResolvedValue(order);

    const input = createInput();
    await useCase.execute(input);

    expect(userRepositoryMock.update).toHaveBeenCalledWith(
      expect.objectContaining({
        balance: initialBalance - ticketPrice,
      })
    );

    expect(ticketOrderRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: input.userId,
        ticketId: input.ticketId,
        price: ticketPrice,
      })
    );
  });

  it('Returns created ticket order', async ({ expect }) => {
    const user = createUserMock(10000);
    const ticket = createTicketMock(500);
    const expectedOrder = createTicketOrderMock();

    vi.mocked(userRepositoryMock.findById).mockResolvedValue(user);
    vi.mocked(ticketRepositoryMock.findById).mockResolvedValue(ticket);
    vi.mocked(ticketOrderRepositoryMock.create).mockResolvedValue(expectedOrder);

    const result = await useCase.execute(createInput());

    expect(result).toBe(expectedOrder);
  });

  it('Handles ticket with no price (free ticket)', async ({ expect }) => {
    const user = createUserMock(0);
    const ticket = new Ticket('ticket-123', 'Free Pass', new Date(), new Date(), null, undefined);
    const order = createTicketOrderMock();

    vi.mocked(userRepositoryMock.findById).mockResolvedValue(user);
    vi.mocked(ticketRepositoryMock.findById).mockResolvedValue(ticket);
    vi.mocked(ticketOrderRepositoryMock.create).mockResolvedValue(order);

    await useCase.execute(createInput());

    expect(userRepositoryMock.update).toHaveBeenCalledWith(
      expect.objectContaining({
        balance: 0,
      })
    );
  });
});
