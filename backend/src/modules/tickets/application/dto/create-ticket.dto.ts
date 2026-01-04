import { ValidTime } from '../../domain/entities/ticket.entity';

export class CreateTicketDto {
  constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly validTime: ValidTime
  ) {}
}
