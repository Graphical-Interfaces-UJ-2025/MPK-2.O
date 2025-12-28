import { inject, injectable } from 'tsyringe';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { Transport } from '../../domain/entities';
import { ITransportRepository, ITransportRepositoryToken } from '../repositories';
import { TRANSPORT_ERRORS } from '../../constants';

@injectable()
export class GetTransportUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(ITransportRepositoryToken) private transportRepository: ITransportRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  async execute(id: string): Promise<Transport> {
    this.logger.info('Attempting to get transport', { transportId: id });

    const transport = await this.transportRepository.findById(id);
    if (!transport) {
      this.logger.warn('Transport not found', { transportId: id });
      throw new Error(TRANSPORT_ERRORS.TRANSPORT_NOT_FOUND);
    }

    this.logger.info('Transport retrieved successfully', {
      transportId: transport.id,
      referenceNumber: transport.referenceNumber,
    });

    return transport;
  }
}
