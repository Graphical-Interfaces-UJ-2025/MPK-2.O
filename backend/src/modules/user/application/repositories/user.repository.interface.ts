import { User } from '../../domain/entities/user.entity';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByPesel(pesel: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  findAll(): Promise<User[]>;
}

export const IUserRepositoryToken = Symbol('IUserRepository');
