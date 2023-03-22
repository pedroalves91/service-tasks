import { RoleType } from '../../../libs/guards/role-type.enum';
import { Expose } from 'class-transformer';

export class User {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  password: string;

  @Expose()
  role: RoleType;
}
