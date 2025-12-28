import { inject, injectable } from 'tsyringe';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { Station } from '../../domain/entities';
import { IStationRepository, IStationRepositoryToken } from '../repositories';
import { STATION_ERRORS } from '../../constants';

@injectable()
export class GetStationUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(IStationRepositoryToken) private stationRepository: IStationRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  async execute(id: string): Promise<Station> {
    this.logger.info('Attempting to get station', { stationId: id });

    const station = await this.stationRepository.findById(id);
    if (!station) {
      this.logger.warn('Station not found', { stationId: id });
      throw new Error(STATION_ERRORS.STATION_NOT_FOUND);
    }

    this.logger.info('Station retrieved successfully', {
      stationId: station.id,
      name: station.name,
    });

    return station;
  }
}
