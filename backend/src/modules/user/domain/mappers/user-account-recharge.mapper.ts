import { UserAccountRecharge } from '../entities/user-account-recharge.entity';
import { TransactionRecord } from '../../../../config/database/schema';

export class UserAccountRechargeMapper {
  static toDomain(record: TransactionRecord): UserAccountRecharge {
    return new UserAccountRecharge(
      record.id,
      parseFloat(record.amount),
      record.status,
      record.createdAt
    );
  }
}
