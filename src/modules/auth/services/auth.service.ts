import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from '../controllers/dtos/login.dto';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  validateUser(login: LoginDto): User | null {
    const user = this.usersService.findOne(login.username);

    if (user.password === login.password) return user;

    throw new UnauthorizedException('Your credentials are wrong');
  }
}
