import 'reflect-metadata';
import { beforeEach, describe, it, vi } from 'vitest';
import { ILogger } from '../../../../shared/application/services/logger.interface';
import { IUserRepository } from '../../../../user/application/repositories/user.repository.interface';
import { User } from '../../../../user/domain/entities/user.entity';
import { ITicketOrderRepository } from '../../repositories/ticket-order.repository.interface';
import { GetUserTicketOrdersHistoryUseCase } from '../get-user-ticket-orders-history.use-case';
import { Pagination } from '../../../../shared/application/query/pagination.query';
import { PaginatedResult } from '../../../../shared/application/query/paginated-result.query';
import { TicketOrder } from '../../../domain/entities/ticket-order.entity';
import { TICKET_ERRORS } from '../../../constants';

const createUserMock = () =>
  new User(
    'user-123',
    '12345678901',
    'test@mail.com',
    'password-hash',
    'password-salt',
    'John',
    'Doe',
    10000,
    'user',
    new Date(),
    new Date()
  );

const createTicketOrderMock = (overrides?: Partial<TicketOrder>) =>
  new TicketOrder(
    overrides?.userId ?? 'user-123',
    overrides?.ticketId ?? 'ticket-123',
    overrides?.validFrom ?? new Date(),
    overrides?.validTo ?? new Date(),
    overrides?.orderedAt ?? new Date(),
    overrides?.price ?? 500,
    overrides?.ticketName ?? 'Monthly Pass'
  );

const createPaginatedResultMock = (
  data: TicketOrder[] = [],
  options?: { limit?: number; offset?: number; total?: number }
) => {
  const mockPagination = new Pagination(options?.limit ?? 20, options?.offset ?? 0);
  return new PaginatedResult(data, mockPagination, options?.total ?? data.length);
};

const userRepositoryMock: IUserRepository = {
  findById: vi.fn(),
  findByPesel: vi.fn(),
  findByEmail: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findAll: vi.fn(),
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

describe('GetUserTicketOrdersHistoryUseCase', () => {
  let useCase: GetUserTicketOrdersHistoryUseCase;

  beforeEach(() => {
    vi.clearAllMocks();

    useCase = new GetUserTicketOrdersHistoryUseCase(
      userRepositoryMock,
      ticketOrderRepositoryMock,
      loggerMock
    );
  });

  it('Fails if user does not exist', async ({ expect }) => {
    vi.mocked(userRepositoryMock.findById).mockResolvedValue(null);

    const pagination = new Pagination(20, 0);

    const response = useCase.execute('user-123', pagination);

    await expect(response).rejects.toThrow(TICKET_ERRORS.USER_NOT_FOUND);
  });

  it('Returns valid paginated ticket orders', async ({ expect }) => {
    const orders = [createTicketOrderMock(), createTicketOrderMock()];
    const paginatedResult = createPaginatedResultMock(orders, { total: 50 });

    vi.mocked(userRepositoryMock.findById).mockResolvedValue(createUserMock());
    vi.mocked(ticketOrderRepositoryMock.findByUserIdPaginated).mockResolvedValue(paginatedResult);

    const pagination = new Pagination(20, 0);

    const response = await useCase.execute('user-123', pagination);

    expect(response).toMatchObject(
      expect.objectContaining({
        pageSize: 2,
        page: 1,
        hasNext: true,
        hasPrev: false,
        data: expect.any(Array),
      })
    );
  });

  it('Returns empty array if offset is more than total', async ({ expect }) => {
    const paginatedResult = createPaginatedResultMock([], { offset: 100, total: 50 });

    vi.mocked(userRepositoryMock.findById).mockResolvedValue(createUserMock());
    vi.mocked(ticketOrderRepositoryMock.findByUserIdPaginated).mockResolvedValue(paginatedResult);

    const pagination = new Pagination(20, 100);

    const response = await useCase.execute('user-123', pagination);

    expect(response).toMatchObject(
      expect.objectContaining({
        data: [],
      })
    );
  });

  it('Calls repository with correct pagination parameters', async ({ expect }) => {
    const paginatedResult = createPaginatedResultMock([]);

    vi.mocked(userRepositoryMock.findById).mockResolvedValue(createUserMock());
    vi.mocked(ticketOrderRepositoryMock.findByUserIdPaginated).mockResolvedValue(paginatedResult);

    const pagination = new Pagination(10, 20);

    await useCase.execute('user-123', pagination);

    expect(ticketOrderRepositoryMock.findByUserIdPaginated).toHaveBeenCalledWith(
      'user-123',
      pagination
    );
  });
});
