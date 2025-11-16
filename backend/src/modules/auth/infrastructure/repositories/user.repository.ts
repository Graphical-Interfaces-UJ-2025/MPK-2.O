import { injectable } from 'tsyringe';
import { IUserRepository } from '../../application/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserModel } from '../database/models/user.model';
import { UserMapper } from '../../domain/mappers/user.mapper';

@injectable()
export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const model = await UserModel.query().findById(id);
    return model ? UserMapper.toDomain(model) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const model = await UserModel.query().findOne({ email });
    return model ? UserMapper.toDomain(model) : null;
  }

  async create(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const model = await UserModel.query().insert(data);
    return UserMapper.toDomain(model);
  }

  async update(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const model = await UserModel.query().patchAndFetchById(user.id, data);
    return UserMapper.toDomain(model);
  }

  async delete(id: string): Promise<void> {
    await UserModel.query().deleteById(id);
  }

  async findAll(): Promise<User[]> {
    const models = await UserModel.query();
    return models.map(UserMapper.toDomain);
  }
}
