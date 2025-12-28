export type TransportType = 'autobus' | 'tram';

export class Transport {
  constructor(
    public readonly id: string,
    public readonly referenceNumber: string,
    public readonly type: TransportType,
    public readonly directionName: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null = null
  ) {}

  static create(
    id: string,
    referenceNumber: string,
    type: TransportType,
    directionName: string
  ): Transport {
    return new Transport(id, referenceNumber, type, directionName, new Date(), new Date(), null);
  }

  update(referenceNumber: string, type: TransportType, directionName: string): Transport {
    return new Transport(
      this.id,
      referenceNumber,
      type,
      directionName,
      this.createdAt,
      new Date(),
      this.deletedAt
    );
  }

  softDelete(): Transport {
    return new Transport(
      this.id,
      this.referenceNumber,
      this.type,
      this.directionName,
      this.createdAt,
      new Date(),
      new Date()
    );
  }

  get isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
