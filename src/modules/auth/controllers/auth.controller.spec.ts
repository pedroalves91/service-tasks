import { AuthService } from '../services/auth.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { AuthController } from './auth.controller';
import { LoginDto } from './dtos/login.dto';
import { RoleType } from '../../../libs/guards/role-type.enum';
import { verify } from 'jsonwebtoken';
import { props } from '../../../../config/props';

describe('AuthController spec', () => {
  let authService: MockProxy<AuthService>;
  let authController: AuthController;

  beforeEach(() => {
    authService = mock<AuthService>();
    authController = new AuthController(authService);
  });

  describe('login', () => {
    it('should return a JWT if login is valid', () => {
      const login = LoginDto.Fixture.loginDto();

      authService.validateUser.mockReturnValueOnce({
        id: 1,
        username: 'new-user',
        password: 'passw0rd',
        role: RoleType.MANAGER,
      });

      const token = authController.login(login);

      let error;
      try {
        verify(token, props.auth.secret);
      } catch (e) {
        error = e;
      }

      expect(token).toBeDefined();
      expect(error).toBeUndefined();
    });
  });
});
