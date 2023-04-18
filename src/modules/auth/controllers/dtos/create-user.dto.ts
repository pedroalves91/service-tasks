import { IsEnum, IsString, MinLength } from "class-validator";
import { RoleType } from "../../../../libs/guards/role-type.enum";

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(RoleType, { message: 'Invalid role type' })
  role: RoleType;

  static Fixture = class {
    static newUser(): CreateUserDto {
      return {
        username: 'john doe',
        password: 'my-super-pass',
        role: RoleType.TECHNICIAN,
      };
    }
  };
}
