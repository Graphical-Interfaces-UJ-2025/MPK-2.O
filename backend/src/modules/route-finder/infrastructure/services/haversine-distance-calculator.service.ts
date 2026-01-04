import { injectable } from 'tsyringe';
import { IGeographicalDistanceCalculator } from '../../application/services/geographical-distance-calculator.interface';
import { GeographicalPoint } from '../../domain/entities';

@injectable()
export class HaversineGeographicalDistanceCalculator implements IGeographicalDistanceCalculator {
  private static readonly EARTH_RADIUS_METERS = 6371000;

  calculateDistance(first: GeographicalPoint, second: GeographicalPoint): number {
    const lat1Rad = this.toRadians(first.latitude);
    const lat2Rad = this.toRadians(second.latitude);
    const deltaLatRad = this.toRadians(second.latitude - first.latitude);
    const deltaLonRad = this.toRadians(second.longitude - first.longitude);

    const a =
      Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return HaversineGeographicalDistanceCalculator.EARTH_RADIUS_METERS * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
