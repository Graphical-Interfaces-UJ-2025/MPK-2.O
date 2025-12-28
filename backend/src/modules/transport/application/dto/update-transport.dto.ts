import { TransportType } from '../../domain/entities';

export class UpdateTransportDto {
  constructor(
    public readonly referenceNumber: string,
    public readonly type: TransportType,
    public readonly directionName: string
  ) {}
}
