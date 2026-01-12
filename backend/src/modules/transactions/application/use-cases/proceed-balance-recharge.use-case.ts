import { inject, injectable } from 'tsyringe';
import {
  ITransactionRepository,
  ITransactionRepositoryToken,
} from '../repositories/transaction.repository.interface';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../user/application/repositories/user.repository.interface';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { TRANSACTION_ERRORS } from '../../constants';
import { USER_ERRORS } from '../../../user/constants';

@injectable()
export class ProceedBalanceRechargeUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(ITransactionRepositoryToken)
    private readonly transactionRepository: ITransactionRepository,
    @inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  public async execute(transactionId: string) {
    this.logger.info('Processing balance recharge', { transactionId });

    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      this.logger.warn('Transaction not found', { transactionId });
      throw new Error(TRANSACTION_ERRORS.TRANSACTION_NOT_FOUND);
    }

    if (transaction.status === 'COMPLETED') {
      this.logger.warn('Transaction already completed', { transactionId });
      throw new Error(TRANSACTION_ERRORS.TRANSACTION_IS_ALREADY_COMPLETED);
    }

    if (transaction.status === 'FAILED') {
      this.logger.warn('Transaction is failed', { transactionId });
      throw new Error(TRANSACTION_ERRORS.TRANSACTION_FAILED);
    }

    const user = await this.userRepository.findById(transaction.userId);
    if (!user) {
      this.logger.warn('User not found', { userId: transaction.userId });
      throw new Error(USER_ERRORS.USER_NOT_FOUND);
    }

    const updatedUser = user.addBalance(transaction.amount);
    await this.userRepository.update(updatedUser);

    const completedTransaction = transaction.complete();
    await this.transactionRepository.update(completedTransaction);

    this.logger.info('Balance recharge completed successfully', {
      transactionId,
      userId: transaction.userId,
      amount: transaction.amount,
      newBalance: updatedUser.balance,
    });
  }
}
