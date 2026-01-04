import { GeographicalPoint } from '../../domain/entities';

export interface IGeographicalDistanceCalculator {
  /**
   * Calculate the distance in meters between two geographical points
   */
  calculateDistance(first: GeographicalPoint, second: GeographicalPoint): number;
}

export const IGeographicalDistanceCalculatorToken = Symbol('IGeographicalDistanceCalculator');
