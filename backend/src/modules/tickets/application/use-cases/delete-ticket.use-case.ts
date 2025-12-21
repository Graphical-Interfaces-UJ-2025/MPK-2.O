import { inject, injectable } from 'tsyringe';
import {
  ITicketRepository,
  ITicketRepositoryToken,
} from '../repositories/ticket.repository.interface';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';

@injectable()
export class DeleteTicketUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(ITicketRepositoryToken) private ticketRepository: ITicketRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child('DeleteTicketUseCase');
  }

  async execute(id: string): Promise<void> {
    this.logger.info('Deleting ticket', { id });

    const ticket = await this.ticketRepository.findByIdIncludeDeleted(id);
    if (!ticket) {
      this.logger.warn('Ticket not found', { id });
      throw new Error('Ticket not found');
    }

    if (ticket.isDeleted) {
      this.logger.warn('Ticket already deleted', { id });
      throw new Error('Ticket already deleted');
    }

    await this.ticketRepository.softDelete(id);
    this.logger.info('Ticket deleted successfully', { id });
  }
}
