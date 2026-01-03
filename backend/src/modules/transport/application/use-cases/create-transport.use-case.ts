import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { Transport } from '../../domain/entities';
import { ITransportRepository, ITransportRepositoryToken } from '../repositories';
import { CreateTransportDto } from '../dto';
import { TRANSPORT_ERRORS } from '../../constants';

@injectable()
export class CreateTransportUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(ITransportRepositoryToken) private transportRepository: ITransportRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  async execute(dto: CreateTransportDto): Promise<Transport> {
    this.logger.info('Attempting to create new transport', {
      referenceNumber: dto.referenceNumber,
    });

    const existingTransport = await this.transportRepository.findByReferenceNumber(
      dto.referenceNumber
    );
    if (existingTransport) {
      this.logger.warn('Transport creation failed: Transport already exists', {
        referenceNumber: dto.referenceNumber,
      });
      throw new Error(TRANSPORT_ERRORS.TRANSPORT_ALREADY_EXISTS);
    }

    const transport = Transport.create(uuidv4(), dto.referenceNumber, dto.type, dto.directionName);

    const createdTransport = await this.transportRepository.create(transport);

    this.logger.info('Transport created successfully', {
      // transportId: createdTransport.id
      referenceNumber: createdTransport.referenceNumber,
    });

    return createdTransport;
  }
}
