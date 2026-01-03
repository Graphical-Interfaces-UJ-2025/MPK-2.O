export class UpdateTrackDto {
  constructor(
    public readonly transportRefNumber: string,
    public readonly stationIds: string[]
  ) {}
}
