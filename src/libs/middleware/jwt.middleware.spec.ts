import { Test } from '@nestjs/testing';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../jwt/jwt-payload';
import { JwtMiddleware } from './jwt.middleware';
import { RoleType } from '../guards/role-type.enum';

describe('JwtMiddleware spec', () => {
  let jwtMiddleware: JwtMiddleware;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [JwtMiddleware],
    }).compile();

    jwtMiddleware = moduleRef.get<JwtMiddleware>(JwtMiddleware);
    req = {} as Request;
    res = {} as Response;
    next = jest.fn();
  });

  describe('use', () => {
    it('should set user in headers if token is present', () => {
      const token = 'fake-jwt-token';
      const payload = {
        id: 1,
        username: 'john.doe',
        role: RoleType.MANAGER,
      };
      jest.spyOn(JwtPayload, 'getJwtPayload').mockReturnValueOnce(payload);
      req.headers = { authorization: `Bearer ${token}` };

      jwtMiddleware.use(req, res, next);

      expect(JwtPayload.getJwtPayload).toHaveBeenCalledWith(token);
      expect(req.headers).toHaveProperty('user', payload);
      expect(next).toHaveBeenCalled();
    });

    it('should not set user in headers if token is not present', () => {
      req.headers = {};

      jwtMiddleware.use(req, res, next);

      expect(req.headers['user']).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });
  });
});
