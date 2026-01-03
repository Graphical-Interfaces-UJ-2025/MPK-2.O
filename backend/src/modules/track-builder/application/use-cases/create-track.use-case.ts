import { inject, injectable } from 'tsyringe';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { Track } from '../../domain/entities';
import { ITrackRepository, ITrackRepositoryToken } from '../repositories';
import { ITransportRepository, ITransportRepositoryToken } from '../../../transport/application/repositories';
import { IStationRepository, IStationRepositoryToken } from '../../../station/application/repositories';
import { CreateTrackDto } from '../dto';
import { TRACK_ERRORS } from '../../constants';

@injectable()
export class CreateTrackUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(ITrackRepositoryToken) private trackRepository: ITrackRepository,
    @inject(ITransportRepositoryToken) private transportRepository: ITransportRepository,
    @inject(IStationRepositoryToken) private stationRepository: IStationRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  async execute(dto: CreateTrackDto): Promise<Track> {
    this.logger.info('Attempting to create new track', {
      transportRefNumber: dto.transportRefNumber,
      stationCount: dto.stationIds.length,
    });

    const transport = await this.transportRepository.findByReferenceNumber(dto.transportRefNumber);
    if (!transport) {
      this.logger.warn('Track creation failed: Transport not found', {
        transportRefNumber: dto.transportRefNumber,
      });
      throw new Error(TRACK_ERRORS.TRANSPORT_NOT_FOUND);
    }

    if (dto.stationIds.length === 0) {
      this.logger.warn('Track creation failed: No stations provided');
      throw new Error(TRACK_ERRORS.STATIONS_REQUIRED);
    }

    for (const stationId of dto.stationIds) {
      const station = await this.stationRepository.findById(stationId);
      if (!station) {
        this.logger.warn('Track creation failed: Station not found', { stationId });
        throw new Error(TRACK_ERRORS.STATION_NOT_FOUND);
      }
    }

    const finalStationId = dto.stationIds[dto.stationIds.length - 1];
    const finalStation = await this.stationRepository.findById(finalStationId);
    const trackName = finalStation!.name;

    const nextId = await this.trackRepository.getNextId();

    const track = Track.create(nextId, trackName, dto.transportRefNumber, dto.stationIds);

    const createdTrack = await this.trackRepository.create(track);

    this.logger.info('Track created successfully', {
      trackId: createdTrack.id,
      name: createdTrack.name,
    });

    return createdTrack;
  }
}
