export class CreateTrackDto {
  constructor(
    public readonly transportRefNumber: string,
    public readonly stationIds: string[]
  ) {}
}
