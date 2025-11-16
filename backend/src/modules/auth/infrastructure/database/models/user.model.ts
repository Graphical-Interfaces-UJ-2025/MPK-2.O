import { Model } from 'objection';

export class UserModel extends Model {
  id!: string;
  email!: string;
  password_hash!: string;
  first_name!: string;
  last_name!: string;
  created_at!: Date;
  updated_at!: Date;

  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'id';
  }

  $beforeInsert() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }
}
