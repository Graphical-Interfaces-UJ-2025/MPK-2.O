export class CreateTicketDto {
  constructor(
    public readonly name: string,
    public readonly price: number
  ) {}
}
