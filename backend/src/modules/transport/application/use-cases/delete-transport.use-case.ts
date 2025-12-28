import { inject, injectable } from 'tsyringe';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { ITransportRepository, ITransportRepositoryToken } from '../repositories';
import { TRANSPORT_ERRORS } from '../../constants';

@injectable()
export class DeleteTransportUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(ITransportRepositoryToken) private transportRepository: ITransportRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  async execute(id: string): Promise<void> {
    this.logger.info('Attempting to soft delete transport', { transportId: id });

    const existingTransport = await this.transportRepository.findById(id);
    if (!existingTransport) {
      this.logger.warn('Transport delete failed: Transport not found', { transportId: id });
      throw new Error(TRANSPORT_ERRORS.TRANSPORT_NOT_FOUND);
    }

    const deletedTransport = existingTransport.softDelete();
    await this.transportRepository.update(deletedTransport);

    this.logger.info('Transport soft deleted successfully', { transportId: id });
  }
}
