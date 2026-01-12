import { inject, injectable } from 'tsyringe';
import {
  ITransactionRepository,
  ITransactionRepositoryToken,
} from '../repositories/transaction.repository.interface';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { Transaction } from '../../domain/entities/transaction.entity';

@injectable()
export class GetUserTransactionsUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(ITransactionRepositoryToken)
    private readonly transactionRepository: ITransactionRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  public async execute(userId: string): Promise<Transaction[]> {
    this.logger.info('Getting user transactions', { userId });

    const transactions = await this.transactionRepository.findByUserId(userId);

    this.logger.info('User transactions retrieved', {
      userId,
      count: transactions.length,
    });

    return transactions;
  }
}
