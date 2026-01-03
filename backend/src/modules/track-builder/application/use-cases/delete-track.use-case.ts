import { inject, injectable } from 'tsyringe';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { ITrackRepository, ITrackRepositoryToken } from '../repositories';
import { TRACK_ERRORS } from '../../constants';

@injectable()
export class DeleteTrackUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(ITrackRepositoryToken) private trackRepository: ITrackRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  async execute(id: number): Promise<void> {
    this.logger.info('Attempting to soft delete track', { trackId: id });

    const existingTrack = await this.trackRepository.findById(id);
    if (!existingTrack) {
      this.logger.warn('Track delete failed: Track not found', { trackId: id });
      throw new Error(TRACK_ERRORS.TRACK_NOT_FOUND);
    }

    const deletedTrack = existingTrack.softDelete();
    await this.trackRepository.update(deletedTrack);

    this.logger.info('Track soft deleted successfully', { trackId: id });
  }
}
