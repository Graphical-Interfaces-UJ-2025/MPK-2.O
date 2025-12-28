import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../user/application/repositories/user.repository.interface';
import {
  ITransactionRepository,
  ITransactionRepositoryToken,
} from '../repositories/transaction.repository.interface';
import {
  IQueueService,
  IQueueServiceToken,
} from '../../../shared/application/services/queue.interface';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TRANSACTION_EVENTS, TRANSACTION_ERRORS } from '../../constants';

const MINIMUM_RECHARGE_AMOUNT = 5000;

@injectable()
export class InitiateBalanceRechargeUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(IUserRepositoryToken) private readonly userRepository: IUserRepository,
    @inject(ITransactionRepositoryToken)
    private readonly transactionRepository: ITransactionRepository,
    @inject(IQueueServiceToken) private readonly queueService: IQueueService,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  public async execute(userId: string, amount: number): Promise<void> {
    this.logger.info('Initiating balance recharge', { userId, amount });

    const user = await this.userRepository.findById(userId);
    if (!user) {
      this.logger.warn('Recharge failed: User not found', { userId });
      throw new Error(TRANSACTION_ERRORS.USER_NOT_FOUND);
    }

    if (amount < MINIMUM_RECHARGE_AMOUNT) {
      this.logger.warn('Recharge failed: Amount below minimum', { userId, amount });
      throw new Error(TRANSACTION_ERRORS.MINIMUM_RECHARGE_AMOUNT);
    }

    const transaction = Transaction.create(uuidv4(), userId, 'RECHARGE', amount, null, 'PENDING');

    await this.transactionRepository.create(transaction);

    await this.queueService.emit(TRANSACTION_EVENTS.RECHARGE_INITIATED, {
      transactionId: transaction.id,
    });

    this.logger.info('Balance recharge initiated successfully', {
      userId,
      transactionId: transaction.id,
      amount,
    });
  }
}
