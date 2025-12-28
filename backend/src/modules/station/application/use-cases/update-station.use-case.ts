import { inject, injectable } from 'tsyringe';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { Station } from '../../domain/entities';
import { IStationRepository, IStationRepositoryToken } from '../repositories';
import { UpdateStationDto } from '../dto';
import { STATION_ERRORS } from '../../constants';

@injectable()
export class UpdateStationUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(IStationRepositoryToken) private stationRepository: IStationRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  async execute(id: string, dto: UpdateStationDto): Promise<Station> {
    this.logger.info('Attempting to update station', { stationId: id });

    const existingStation = await this.stationRepository.findById(id);
    if (!existingStation) {
      this.logger.warn('Station update failed: Station not found', { stationId: id });
      throw new Error(STATION_ERRORS.STATION_NOT_FOUND);
    }

    const stationWithSameName = await this.stationRepository.findByName(dto.name);
    if (stationWithSameName && stationWithSameName.id !== id) {
      this.logger.warn('Station update failed: Name already exists', { name: dto.name });
      throw new Error(STATION_ERRORS.STATION_ALREADY_EXISTS);
    }

    const updatedStation = existingStation.update(dto.name, dto.longitude, dto.latitude);
    const savedStation = await this.stationRepository.update(updatedStation);

    this.logger.info('Station updated successfully', {
      stationId: savedStation.id,
      name: savedStation.name,
    });

    return savedStation;
  }
}
