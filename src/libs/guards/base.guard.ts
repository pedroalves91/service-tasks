import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { RoleType } from './role-type.enum';
import { Reflector } from '@nestjs/core';

export abstract class BaseGuard implements CanActivate {
  protected constructor(protected readonly reflector: Reflector) {}

  abstract canActivate(context: ExecutionContext): Promise<boolean> | boolean;

  handleRoute(context: ExecutionContext, roleType: RoleType): boolean {
    const roles = this.reflector.get<string[]>('role', context.getHandler());

    if (!roles) {
      throw new UnauthorizedException(
        'You need to be authenticated to access this',
      );
    }

    return roles.includes(roleType);
  }
}
