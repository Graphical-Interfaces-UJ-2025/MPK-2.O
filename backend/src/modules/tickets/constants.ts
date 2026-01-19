export const TICKET_ERRORS = {
  TICKET_NOT_FOUND: 'Ticket not found',
  TICKET_ALREADY_DELETED: 'Ticket already deleted',
  INSUFFICIENT_BALANCE: 'Insufficient balance to purchase ticket',
  USER_NOT_FOUND: 'User not found',
  TICKET_ORDER_NOT_FOUND: 'Ticket order not found',
  TICKET_NOT_REFUNDABLE: 'Ticket is not refundable (more than 10% of validity period has passed)',
  TICKET_ORDER_NO_PRICE: 'Ticket order has no price information',
} as const;
