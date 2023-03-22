import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../controllers/dtos/login.dto';
import { mock, MockProxy } from 'jest-mock-extended';
import { UsersService } from './users.service';
import { RoleType } from '../../../libs/guards/role-type.enum';

describe('AuthService spec', () => {
  let usersService: MockProxy<UsersService>;
  let authService: AuthService;

  beforeEach(() => {
    usersService = mock<UsersService>();
    authService = new AuthService(usersService);
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', () => {
      const login = LoginDto.Fixture.loginDto();

      usersService.findOne.mockReturnValue({
        id: 1,
        username: 'new-user',
        password: 'passw0rd',
        role: RoleType.MANAGER,
      });
      const user = authService.validateUser(login);

      expect(user).toBeDefined();
      expect(user.username).toEqual('new-user');
    });

    it('should unauthorized if credentials are invalid', () => {
      const login = LoginDto.Fixture.loginDto();

      usersService.findOne.mockReturnValue({
        id: 1,
        username: 'new-user',
        password: 'fake-pass',
        role: RoleType.MANAGER,
      });

      let error;
      try {
        authService.validateUser(login);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(UnauthorizedException);
    });
  });
});
