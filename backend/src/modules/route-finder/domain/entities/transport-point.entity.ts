import { Station } from '../../../station/domain/entities';

export class TransportPoint {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly stations: Station[],
    public readonly estimatedTravelSeconds: number
  ) {}
}
