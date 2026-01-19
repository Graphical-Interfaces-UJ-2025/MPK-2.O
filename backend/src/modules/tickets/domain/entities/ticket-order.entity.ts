export class TicketOrder {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly ticketId: string,
    public readonly validFrom: Date,
    public readonly validTo: Date,
    public readonly orderedAt: Date,
    public readonly price: number | null,
    public readonly isRefunded: boolean = false,
    public readonly ticketName?: string
  ) {}

  /**
   * Checks if the ticket order is refundable.
   * A ticket is refundable if:
   * - It has NOT been refunded already
   * - It has a validity period of at least 7 days
   * - Less than 10% of its validity period has passed
   */
  get isRefundable(): boolean {
    // If already refunded, cannot refund again
    if (this.isRefunded) {
      return false;
    }

    const now = new Date();
    const totalDuration = this.validTo.getTime() - this.validFrom.getTime();
    const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

    // Ticket must have at least 7 days validity to be refundable
    if (totalDuration < SEVEN_DAYS_IN_MS) {
      return false;
    }

    // If ticket hasn't started yet, it's refundable
    if (now < this.validFrom) {
      return true;
    }

    // If ticket has expired, it's not refundable
    if (now > this.validTo) {
      return false;
    }

    const elapsedDuration = now.getTime() - this.validFrom.getTime();
    const elapsedPercentage = (elapsedDuration / totalDuration) * 100;

    return elapsedPercentage < 10;
  }

  /**
   * Calculates the refundable price based on how much of the ticket's validity has been used.
   * Returns the full price if less than 10% has elapsed, otherwise 0.
   */
  get refundablePrice(): number {
    if (!this.price) {
      return 0;
    }

    if (!this.isRefundable) {
      return 0;
    }

    // If ticket hasn't started yet, full refund
    const now = new Date();
    if (now < this.validFrom) {
      return this.price;
    }

    // Calculate remaining value (full price minus used portion)
    const totalDuration = this.validTo.getTime() - this.validFrom.getTime();
    const elapsedDuration = now.getTime() - this.validFrom.getTime();
    const elapsedPercentage = elapsedDuration / totalDuration;

    // Return price minus the used portion
    return Math.floor(this.price * (1 - elapsedPercentage));
  }

  /**
   * Calculates how much of the ticket's validity period has elapsed as a percentage.
   */
  get elapsedPercentage(): number {
    const now = new Date();

    if (now < this.validFrom) {
      return 0;
    }

    if (now > this.validTo) {
      return 100;
    }

    const totalDuration = this.validTo.getTime() - this.validFrom.getTime();
    const elapsedDuration = now.getTime() - this.validFrom.getTime();

    return (elapsedDuration / totalDuration) * 100;
  }

  /**
   * Marks the ticket order as refunded.
   * Returns a new instance with isRefunded set to true.
   */
  markAsRefunded(): TicketOrder {
    return new TicketOrder(
      this.id,
      this.userId,
      this.ticketId,
      this.validFrom,
      this.validTo,
      this.orderedAt,
      this.price,
      true,
      this.ticketName
    );
  }
}
