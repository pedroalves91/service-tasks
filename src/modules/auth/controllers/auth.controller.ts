import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from './dtos/login.dto';
import { props } from '../../../../config/props';
import { sign } from 'jsonwebtoken';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() login: LoginDto): string {
    const user = this.authService.validateUser(login);

    return sign(
      {
        metadata: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
      props.auth.secret,
    );
  }
}
