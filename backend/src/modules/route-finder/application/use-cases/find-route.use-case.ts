import { inject, injectable } from 'tsyringe';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import {
  IStationRepository,
  IStationRepositoryToken,
} from '../../../station/application/repositories';
import {
  ITrackRepository,
  ITrackRepositoryToken,
} from '../../../track-builder/application/repositories';
import { IStationFinder, IStationFinderToken } from '../services/station-finder.interface';
import {
  IWalkingTimeEstimator,
  IWalkingTimeEstimatorToken,
} from '../services/walking-time-estimator.interface';
import { FindRouteDto, Location } from '../dto';
import { Route, TransportPoint, AccessPoint, GeographicalPoint } from '../../domain/entities';
import { Station } from '../../../station/domain/entities';
import { Track } from '../../../track-builder/domain/entities';
import { ROUTE_FINDER_ERRORS, STATION_THRESHOLD_METERS } from '../../constants';
import { Pagination } from '../../../shared/application/query/pagination.query';

interface ResolvedLocation {
  station: Station;
  walkingDistanceMeters: number;
  originalPoint: GeographicalPoint | null;
}

@injectable()
export class FindRouteUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(IStationRepositoryToken) private stationRepository: IStationRepository,
    @inject(ITrackRepositoryToken) private trackRepository: ITrackRepository,
    @inject(IStationFinderToken) private stationFinder: IStationFinder,
    @inject(IWalkingTimeEstimatorToken) private walkingTimeEstimator: IWalkingTimeEstimator,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  async execute(dto: FindRouteDto): Promise<Route[]> {
    this.logger.info('Attempting to find route', {
      start: dto.start,
      destination: dto.destination,
    });

    const startResolved = await this.resolveLocation(dto.start);
    if (!startResolved) {
      this.logger.warn('No station found within threshold for start location');
      return [];
    }

    const destinationResolved = await this.resolveLocation(dto.destination);
    if (!destinationResolved) {
      this.logger.warn('No station found within threshold for destination location');
      return [];
    }

    this.logger.info('Resolved locations', {
      startStation: startResolved.station.id,
      destinationStation: destinationResolved.station.id,
    });

    const track = await this.findDirectTrack(
      startResolved.station.id,
      destinationResolved.station.id
    );
    if (!track) {
      this.logger.warn('No direct route found between stations');
      return [];
    }

    const route = await this.buildRoute(track, startResolved, destinationResolved);

    this.logger.info('Route found successfully', { trackId: track.id });
    return [route];
  }

  private async resolveLocation(location: Location): Promise<ResolvedLocation | null> {
    if (location.type === 'station') {
      const station = await this.stationRepository.findById(location.stationId);
      if (!station) {
        throw new Error(ROUTE_FINDER_ERRORS.STATION_NOT_FOUND);
      }
      return { station, walkingDistanceMeters: 0, originalPoint: null };
    }

    const point = new GeographicalPoint(location.longitude, location.latitude);
    const result = await this.stationFinder.findNearestStation(point, STATION_THRESHOLD_METERS);
    if (!result) {
      return null;
    }

    return {
      station: result.station,
      walkingDistanceMeters: result.distanceMeters,
      originalPoint: point,
    };
  }

  private async findDirectTrack(
    startStationId: string,
    destinationStationId: string
  ): Promise<Track | null> {
    const pagination = new Pagination(1000, 0);
    const tracksResult = await this.trackRepository.findAll(pagination);

    for (const track of tracksResult.data) {
      const startIndex = track.stationIds.indexOf(startStationId);
      const destinationIndex = track.stationIds.indexOf(destinationStationId);

      if (startIndex !== -1 && destinationIndex !== -1 && startIndex < destinationIndex) {
        return track;
      }
    }

    return null;
  }

  private async buildRoute(
    track: Track,
    start: ResolvedLocation,
    destination: ResolvedLocation
  ): Promise<Route> {
    const travelPoints: (TransportPoint | AccessPoint)[] = [];

    if (start.originalPoint) {
      const walkSeconds = this.walkingTimeEstimator.estimateSeconds(start.walkingDistanceMeters);
      travelPoints.push(
        new AccessPoint(
          walkSeconds,
          0,
          start.originalPoint,
          new GeographicalPoint(start.station.location.longitude, start.station.location.latitude)
        )
      );
    }

    const startIndex = track.stationIds.indexOf(start.station.id);
    const destinationIndex = track.stationIds.indexOf(destination.station.id);
    const routeStationIds = track.stationIds.slice(startIndex, destinationIndex + 1);

    const stations = await this.fetchStations(routeStationIds);

    travelPoints.push(
      new TransportPoint(
        track.id.toString(),
        track.name,
        stations,
        this.estimateTravelTime(routeStationIds.length)
      )
    );

    if (destination.originalPoint) {
      const walkSeconds = this.walkingTimeEstimator.estimateSeconds(
        destination.walkingDistanceMeters
      );
      travelPoints.push(
        new AccessPoint(
          0,
          walkSeconds,
          new GeographicalPoint(
            destination.station.location.longitude,
            destination.station.location.latitude
          ),
          destination.originalPoint
        )
      );
    }

    return new Route(travelPoints);
  }

  private async fetchStations(stationIds: string[]): Promise<Station[]> {
    const stations: Station[] = [];
    for (const id of stationIds) {
      const station = await this.stationRepository.findById(id);
      if (station) {
        stations.push(station);
      }
    }
    return stations;
  }

  private estimateTravelTime(stationCount: number): number {
    // 2 minutes per station
    return stationCount * 120;
  }
}
