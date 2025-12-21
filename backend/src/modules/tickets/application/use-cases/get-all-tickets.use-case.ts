import { inject, injectable } from 'tsyringe';
import {
  ITicketRepository,
  ITicketRepositoryToken,
} from '../repositories/ticket.repository.interface';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { Ticket } from '../../domain/entities/ticket.entity';

@injectable()
export class GetAllTicketsUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(ITicketRepositoryToken) private ticketRepository: ITicketRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child('GetAllTicketsUseCase');
  }

  async execute(includeDeleted: boolean): Promise<Ticket[]> {
    this.logger.info('Getting all tickets', { includeDeleted });

    const tickets = includeDeleted
      ? await this.ticketRepository.findAllIncludeDeleted()
      : await this.ticketRepository.findAll();

    this.logger.info('Tickets retrieved successfully', { count: tickets.length });
    return tickets;
  }
}
