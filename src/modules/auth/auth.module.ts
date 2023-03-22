import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [UsersService, AuthService],
})
export class AuthModule {}
