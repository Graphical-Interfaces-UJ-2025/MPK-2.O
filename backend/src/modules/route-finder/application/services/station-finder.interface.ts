import { Station } from '../../../station/domain/entities';
import { GeographicalPoint } from '../../domain/entities';

export interface NearestStationResult {
  station: Station;
  distanceMeters: number;
}

export interface IStationFinder {
  /**
   * Find the nearest station to a geographical point within a threshold
   * @returns The nearest station and distance, or null if none within threshold
   */
  findNearestStation(
    point: GeographicalPoint,
    thresholdMeters: number
  ): Promise<NearestStationResult | null>;
}

export const IStationFinderToken = Symbol('IStationFinder');
