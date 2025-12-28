import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { Station } from '../../domain/entities';
import { IStationRepository, IStationRepositoryToken } from '../repositories';
import { CreateStationDto } from '../dto';
import { STATION_ERRORS } from '../../constants';

@injectable()
export class CreateStationUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(IStationRepositoryToken) private stationRepository: IStationRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  async execute(dto: CreateStationDto): Promise<Station> {
    this.logger.info('Attempting to create new station', { name: dto.name });

    const existingStation = await this.stationRepository.findByName(dto.name);
    if (existingStation) {
      this.logger.warn('Station creation failed: Station already exists', { name: dto.name });
      throw new Error(STATION_ERRORS.STATION_ALREADY_EXISTS);
    }

    const station = Station.create(uuidv4(), dto.name, dto.longitude, dto.latitude);

    const createdStation = await this.stationRepository.create(station);

    this.logger.info('Station created successfully', {
      stationId: createdStation.id,
      name: createdStation.name,
    });

    return createdStation;
  }
}
