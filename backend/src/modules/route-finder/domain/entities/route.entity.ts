import { TransportPoint } from './transport-point.entity';
import { AccessPoint } from './access-point.entity';

export type TravelStationPoint = TransportPoint | AccessPoint;

export class Route {
  constructor(public readonly travelStationPoints: TravelStationPoint[]) {}

  get isEmpty(): boolean {
    return this.travelStationPoints.length === 0;
  }
}
