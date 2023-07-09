import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../controllers/dtos/login.dto';
import { User } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../controllers/dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  findOne(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
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

    // Create a new user
    return this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
  }
}
