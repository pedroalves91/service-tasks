import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../controllers/dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../controllers/dtos/create-user.dto';
import { RoleType } from '../../../libs/guards/role-type.enum';
import { PrismaService } from './prisma.service';

describe('AuthService spec', () => {
  let prisma: PrismaService;
  let authService: AuthService;

  beforeEach(() => {
    prisma = new PrismaService();
    authService = new AuthService(prisma);
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const login = LoginDto.Fixture.loginDto();
      const hashedPassword = await bcrypt.hash(login.password, 10);

      jest.spyOn(authService, 'findOne').mockResolvedValue({
        id: 1,
        username: 'new-user',
        password: hashedPassword,
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
        await authService.validateUser(login);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('signup', () => {
    it('should sign up a new user', async () => {
      const newUser = CreateUserDto.Fixture.newUser();

      jest.spyOn(authService, 'findOne').mockResolvedValue(undefined);
      jest.spyOn(prisma.user, 'create').mockResolvedValue({
        id: 1,
        username: newUser.username,
        password: newUser.password,
        role: newUser.role,
        createdAt: new Date(),
        deletedAt: null,
      });

      const user = await authService.signup(newUser);

      expect(user.username).toEqual(newUser.username);
    });

    it('should throw an error if user already exists', async () => {
      const newUser = CreateUserDto.Fixture.newUser();

      jest.spyOn(authService, 'findOne').mockResolvedValue({
        id: 1,
        username: newUser.username,
        password: newUser.password,
        role: newUser.role,
      });

      let error;
      try {
        await authService.signup(newUser);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(ConflictException);
    });
  });
});
