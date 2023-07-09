import { SetMetadata } from '@nestjs/common';
import { CustomDecorator } from '@nestjs/common/decorators/core/set-metadata.decorator';

export const GuardRole = (...roles: string[]): CustomDecorator => SetMetadata('role', roles);
