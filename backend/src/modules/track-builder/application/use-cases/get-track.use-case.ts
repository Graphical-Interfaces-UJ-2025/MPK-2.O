import { inject, injectable } from 'tsyringe';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { Track } from '../../domain/entities';
import { ITrackRepository, ITrackRepositoryToken } from '../repositories';
import { TRACK_ERRORS } from '../../constants';

@injectable()
export class GetTrackUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(ITrackRepositoryToken) private trackRepository: ITrackRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  async execute(id: number): Promise<Track> {
    this.logger.info('Attempting to get track', { trackId: id });

    const track = await this.trackRepository.findById(id);
    if (!track) {
      this.logger.warn('Track not found', { trackId: id });
      throw new Error(TRACK_ERRORS.TRACK_NOT_FOUND);
    }

    this.logger.info('Track retrieved successfully', {
      trackId: track.id,
      name: track.name,
    });

    return track;
  }
}
