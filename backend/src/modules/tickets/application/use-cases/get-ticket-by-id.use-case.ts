import { inject, injectable } from 'tsyringe';
import {
  ITicketRepository,
  ITicketRepositoryToken,
} from '../repositories/ticket.repository.interface';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { Ticket } from '../../domain/entities/ticket.entity';

@injectable()
export class GetTicketByIdUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(ITicketRepositoryToken) private ticketRepository: ITicketRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child('GetTicketByIdUseCase');
  }

  async execute(id: string, includeDeleted: boolean): Promise<Ticket | null> {
    this.logger.info('Getting ticket by id', { id, includeDeleted });

    const ticket = includeDeleted
      ? await this.ticketRepository.findByIdIncludeDeleted(id)
      : await this.ticketRepository.findById(id);

    if (ticket) {
      this.logger.info('Ticket retrieved successfully', { id: ticket.id, name: ticket.name });
    } else {
      this.logger.warn('Ticket not found', { id });
    }

    return ticket;
  }
}
