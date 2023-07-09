import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../jwt/jwt-payload';
import { ManagerGuard } from './manager.guard';
import { JwtMetadataDto } from '../jwt/jwt-metadata.dto';
import { RoleType } from './role-type.enum';

describe('ManagerGuard', () => {
  let guard: ManagerGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new ManagerGuard(reflector);
  });

  describe('canActivate', () => {
    it('should allow access for a manager user', () => {
      const jwtPayload: JwtMetadataDto = {
        id: 1,
        username: 'user',
        role: RoleType.MANAGER,
      };
      const context: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer abc123',
            },
          }),
        }),
      } as ExecutionContext;

      jest.spyOn(JwtPayload, 'getJwtPayload').mockReturnValue(jwtPayload);
      jest.spyOn(guard, 'handleRoute').mockReturnValue(true);

      const result = guard.canActivate(context);

      expect(result).toEqual(true);
    });

    it('should forbid access for a non-manager user', () => {
      const jwtPayload: JwtMetadataDto = {
        id: 1,
        username: 'user',
        role: RoleType.TECHNICIAN,
      };
      const context: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer abc123',
            },
          }),
        }),
      } as ExecutionContext;

      jest.spyOn(JwtPayload, 'getJwtPayload').mockReturnValue(jwtPayload);
      jest.spyOn(guard, 'handleRoute').mockReturnValue(false);

      expect(() => {
        guard.canActivate(context);
      }).toThrowError(new ForbiddenException(`Resource not allowed for user role'`));
    });
  });
});
