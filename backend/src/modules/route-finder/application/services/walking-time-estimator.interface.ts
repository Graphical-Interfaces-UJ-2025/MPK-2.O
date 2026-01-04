export interface IWalkingTimeEstimator {
  /**
   * Estimate walking time in seconds for a given distance in meters
   */
  estimateSeconds(distanceMeters: number): number;
}

export const IWalkingTimeEstimatorToken = Symbol('IWalkingTimeEstimator');
