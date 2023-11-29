import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../controllers/dtos/login.dto';
import { User } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../controllers/dtos/create-user.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  findOne(username: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { username } }) as Promise<User>;
  }

  async validateUser(login: LoginDto): Promise<User | null> {
    const user = await this.findOne(login.username);

    if (!user) throw new NotFoundException('user not found');

    const isMatch = await bcrypt.compare(login.password, user.password);
    if (isMatch) return user;

    throw new UnauthorizedException('Your credentials are wrong');
  }

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    // Check if user already exists
    const userExists = await this.findOne(username);
    if (userExists) {
      throw new ConflictException('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      ...createUserDto,
      password: hashedPassword,
    };

    // Create a new user
    return this.prisma.user.create({ data });
  }
}
