import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { User } from './models/user.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmOptions } from 'config/datasources/type.orm.options';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmOptions,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
