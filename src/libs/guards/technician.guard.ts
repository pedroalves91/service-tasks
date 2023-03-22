import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { BaseGuard } from './base.guard';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayload } from '../jwt/jwt-payload';

@Injectable()
export class TechnicianGuard extends BaseGuard {
  constructor(protected readonly reflector: Reflector) {
    super(reflector);
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;
    const token = authorization.startsWith('Bearer')
      ? authorization.split(' ')[1]
      : authorization;
    const jwtMetadata = JwtPayload.getJwtPayload(token);

    if (!this.handleRoute(context, jwtMetadata.role)) {
      throw new ForbiddenException(`Resource not allowed for user role'`);
    }

    return true;
  }
}
