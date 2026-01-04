import { GeographicalPoint } from './geographical-point.entity';

export class AccessPoint {
  constructor(
    public readonly startWalkSeconds: number,
    public readonly destinationWalkSeconds: number,
    public readonly startPoint: GeographicalPoint,
    public readonly destinationPoint: GeographicalPoint
  ) {}
}
