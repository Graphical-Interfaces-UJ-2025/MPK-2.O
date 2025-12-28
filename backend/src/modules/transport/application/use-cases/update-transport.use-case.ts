import { inject, injectable } from 'tsyringe';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { Transport } from '../../domain/entities';
import { ITransportRepository, ITransportRepositoryToken } from '../repositories';
import { UpdateTransportDto } from '../dto';
import { TRANSPORT_ERRORS } from '../../constants';

@injectable()
export class UpdateTransportUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(ITransportRepositoryToken) private transportRepository: ITransportRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  async execute(id: string, dto: UpdateTransportDto): Promise<Transport> {
    this.logger.info('Attempting to update transport', { transportId: id });

    const existingTransport = await this.transportRepository.findById(id);
    if (!existingTransport) {
      this.logger.warn('Transport update failed: Transport not found', { transportId: id });
      throw new Error(TRANSPORT_ERRORS.TRANSPORT_NOT_FOUND);
    }

    const transportWithSameRef = await this.transportRepository.findByReferenceNumber(
      dto.referenceNumber
    );
    if (transportWithSameRef && transportWithSameRef.id !== id) {
      this.logger.warn('Transport update failed: Reference number already exists', {
        referenceNumber: dto.referenceNumber,
      });
      throw new Error(TRANSPORT_ERRORS.TRANSPORT_ALREADY_EXISTS);
    }

    const updatedTransport = existingTransport.update(
      dto.referenceNumber,
      dto.type,
      dto.directionName
    );
    const savedTransport = await this.transportRepository.update(updatedTransport);

    this.logger.info('Transport updated successfully', {
      transportId: savedTransport.id,
      referenceNumber: savedTransport.referenceNumber,
    });

    return savedTransport;
  }
}
