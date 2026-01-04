import { injectable } from 'tsyringe';
import { IWalkingTimeEstimator } from '../../application/services/walking-time-estimator.interface';

@injectable()
export class CoefficientWalkingTimeEstimator implements IWalkingTimeEstimator {
  // Average walking speed: ~1.4 m/s (5 km/h)
  // Coefficient: seconds per meter = 1 / 1.4 ≈ 0.714
  private static readonly SECONDS_PER_METER = 0.714;

  estimateSeconds(distanceMeters: number): number {
    return Math.round(distanceMeters * CoefficientWalkingTimeEstimator.SECONDS_PER_METER);
  }
}
