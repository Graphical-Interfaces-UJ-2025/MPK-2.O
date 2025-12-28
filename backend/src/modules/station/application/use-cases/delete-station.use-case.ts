import { inject, injectable } from 'tsyringe';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { IStationRepository, IStationRepositoryToken } from '../repositories';
import { STATION_ERRORS } from '../../constants';

@injectable()
export class DeleteStationUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(IStationRepositoryToken) private stationRepository: IStationRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  async execute(id: string): Promise<void> {
    this.logger.info('Attempting to soft delete station', { stationId: id });

    const existingStation = await this.stationRepository.findById(id);
    if (!existingStation) {
      this.logger.warn('Station delete failed: Station not found', { stationId: id });
      throw new Error(STATION_ERRORS.STATION_NOT_FOUND);
    }

    const deletedStation = existingStation.softDelete();
    await this.stationRepository.update(deletedStation);

    this.logger.info('Station soft deleted successfully', { stationId: id });
  }
}
