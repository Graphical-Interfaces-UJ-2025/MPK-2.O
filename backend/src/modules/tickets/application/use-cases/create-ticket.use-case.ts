import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import {
  ITicketRepository,
  ITicketRepositoryToken,
} from '../repositories/ticket.repository.interface';
import {
  ITicketPriceRepository,
  ITicketPriceRepositoryToken,
} from '../repositories/ticket-price.repository.interface';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { Ticket } from '../../domain/entities/ticket.entity';
import { TicketPrice } from '../../domain/entities/ticket-price.entity';
import { CreateTicketDto } from '../dto/create-ticket.dto';

@injectable()
export class CreateTicketUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(ITicketRepositoryToken) private ticketRepository: ITicketRepository,
    @inject(ITicketPriceRepositoryToken) private ticketPriceRepository: ITicketPriceRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child('CreateTicketUseCase');
  }

  async execute(dto: CreateTicketDto): Promise<Ticket> {
    this.logger.info('Creating new ticket', {
      name: dto.name,
      price: dto.price,
      validTime: dto.validTime
    });

    const ticketId = uuidv4();
    const ticket = Ticket.create(ticketId, dto.name, dto.validTime);
    const createdTicket = await this.ticketRepository.create(ticket);

    const ticketPrice = TicketPrice.create(ticketId, dto.price);
    await this.ticketPriceRepository.create(ticketPrice);

    this.logger.info('Ticket created successfully', {
      id: createdTicket.id,
      name: createdTicket.name,
      price: dto.price,
      validTime: dto.validTime,
    });

    return new Ticket(
      createdTicket.id,
      createdTicket.name,
      createdTicket.createdAt,
      createdTicket.updatedAt,
      createdTicket.deletedAt,
      dto.validTime,
      dto.price
    );
  }
}
