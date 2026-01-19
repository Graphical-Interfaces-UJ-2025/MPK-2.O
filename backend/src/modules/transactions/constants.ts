export const TRANSACTION_EVENTS = {
  RECHARGE_INITIATED: 'transaction.recharge.initiated',
  REFUND_INITIATED: 'transaction.refund.initiated',
} as const;

export const TRANSACTION_ERRORS = {
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  TRANSACTION_IS_ALREADY_COMPLETED: 'Transaction is already completed',
  TRANSACTION_FAILED: 'Transaction is failed',
  MINIMUM_RECHARGE_AMOUNT: 'Minimum transaction amount is 5000',
  USER_NOT_FOUND: 'User not found',
} as const;
