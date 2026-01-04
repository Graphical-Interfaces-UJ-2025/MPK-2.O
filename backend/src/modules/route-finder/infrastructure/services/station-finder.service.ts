import { inject, injectable } from 'tsyringe';
import { IStationFinder, NearestStationResult } from '../../application/services/station-finder.interface';
import {
  IGeographicalDistanceCalculator,
  IGeographicalDistanceCalculatorToken,
} from '../../application/services/geographical-distance-calculator.interface';
import { IStationRepository, IStationRepositoryToken } from '../../../station/application/repositories';
import { GeographicalPoint } from '../../domain/entities';
import { Pagination } from '../../../shared/application/query/pagination.query';

@injectable()
export class StationFinderService implements IStationFinder {
  constructor(
    @inject(IStationRepositoryToken) private stationRepository: IStationRepository,
    @inject(IGeographicalDistanceCalculatorToken) private distanceCalculator: IGeographicalDistanceCalculator
  ) {}

  async findNearestStation(point: GeographicalPoint, thresholdMeters: number): Promise<NearestStationResult | null> {
    const pagination = new Pagination(1000, 0);
    const stationsResult = await this.stationRepository.findAll(pagination);

    let nearestStation: NearestStationResult | null = null;

    for (const station of stationsResult.data) {
      const stationPoint = new GeographicalPoint(station.location.longitude, station.location.latitude);
      const distance = this.distanceCalculator.calculateDistance(point, stationPoint);

      if (distance <= thresholdMeters) {
        if (!nearestStation || distance < nearestStation.distanceMeters) {
          nearestStation = { station, distanceMeters: distance };
        }
      }
    }

    return nearestStation;
  }
}
