import { TransportType } from '../../domain/entities';

export class CreateTransportDto {
  constructor(
    public readonly referenceNumber: string,
    public readonly type: TransportType,
    public readonly directionName: string
  ) {}
}
