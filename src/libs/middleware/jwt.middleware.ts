import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../jwt/jwt-payload';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    let decoded;
    if (token) {
      decoded = JwtPayload.getJwtPayload(token);
    }
    req.headers['user'] = decoded;
    next();
  }
}
