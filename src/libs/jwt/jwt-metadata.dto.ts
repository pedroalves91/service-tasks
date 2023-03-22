import { Expose } from 'class-transformer';
import { RoleType } from '../guards/role-type.enum';

export class JwtMetadataDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  role: RoleType;

  static Fixture = class {
    static newManager(): JwtMetadataDto {
      return {
        id: 1,
        username: 'manager',
        role: RoleType.MANAGER,
      };
    }

    static newTechnician(): JwtMetadataDto {
      return {
        id: 1,
        username: 'tech',
        role: RoleType.TECHNICIAN,
      };
    }
  };
}
