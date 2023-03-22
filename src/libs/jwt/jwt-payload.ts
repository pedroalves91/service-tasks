import { UnauthorizedException } from '@nestjs/common';
import { props } from '../../../config/props';
import { verify } from 'jsonwebtoken';
import { JwtMetadataDto } from './jwt-metadata.dto';

export class JwtPayload {
  static getJwtPayload(jwt?: string): JwtMetadataDto {
    if (!jwt) {
      throw new UnauthorizedException(`A JWT is needed for authorization`);
    }

    const jwtPayload = verify(jwt, props.auth.secret);

    return {
      id: jwtPayload['metadata']['id'],
      username: jwtPayload['metadata']['username'],
      role: jwtPayload['metadata']['role'],
    };
  }
}
