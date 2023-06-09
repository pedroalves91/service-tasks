import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from './dtos/login.dto';
import { sign } from 'jsonwebtoken';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from '../models/user.model';
import { props } from '../../../../config/props';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() login: LoginDto): Promise<string> {
    const user = await this.authService.validateUser(login);

    return sign(
      {
        metadata: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
      props.auth.secret
    );
  }

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.signup(createUserDto);
  }
}
