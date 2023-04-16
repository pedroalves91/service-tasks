import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../controllers/dtos/login.dto';
import { mock, MockProxy } from 'jest-mock-extended';
import { RoleType } from '../../../libs/guards/role-type.enum';
import { Repository } from 'typeorm';
import { User } from '../models/user.model';

describe('AuthService spec', () => {
  let usersRepository: MockProxy<Repository<User>>;
  let authService: AuthService;

  beforeEach(() => {
    usersRepository = mock<Repository<User>>();
    authService = new AuthService(usersRepository);
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const login = LoginDto.Fixture.loginDto();

      jest.spyOn(authService, 'findOne').mockResolvedValue({
        id: 1,
        username: 'new-user',
        password: 'passw0rd',
        role: RoleType.MANAGER,
      });

      const user = await authService.validateUser(login);

      expect(user).toBeDefined();
      expect(user.username).toEqual('new-user');
    });

    it('should unauthorized if credentials are invalid', async () => {
      const login = LoginDto.Fixture.loginDto();

      jest.spyOn(authService, 'findOne').mockResolvedValue({
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
