import { Expose } from 'class-transformer';

export class LoginDto {
  @Expose()
  username: string;

  @Expose()
  password: string;

  static Fixture = class {
    static loginDto(): LoginDto {
      return {
        username: 'new-user',
        password: 'passw0rd',
      };
    }
  };
}
