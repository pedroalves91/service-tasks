import { UnauthorizedException } from '@nestjs/common';
import { props } from '../../../config/props';
import { JsonWebTokenError, sign } from 'jsonwebtoken';
import { JwtPayload } from './jwt-payload';
import { RoleType } from '../guards/role-type.enum';

describe('JwtPayload spec', () => {
  describe('getJwtPayload', () => {
    it('should throw unauthorized exception when there is no token', () => {
      let error;
      try {
        JwtPayload.getJwtPayload(undefined);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(UnauthorizedException);
    });

    it('should throw exception when token is invalid', () => {
      let error;
      try {
        JwtPayload.getJwtPayload('fake-token');
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(JsonWebTokenError);
    });

    it('should return metadata for a valid token', () => {
      const tokenPayloadMetadata = {
        id: 1,
        username: 'username',
        role: RoleType.MANAGER,
      };

      const validToken = sign(
        {
          metadata: tokenPayloadMetadata,
        },
        props.auth.secret,
      );

      const expectedPayload = JwtPayload.getJwtPayload(validToken);
      expect(expectedPayload.id).toEqual(tokenPayloadMetadata.id);
      expect(expectedPayload.username).toEqual(tokenPayloadMetadata.username);
      expect(expectedPayload.role).toEqual(tokenPayloadMetadata.role);
    });
  });
});
