import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../models/user.model';
import { RoleType } from '../../../libs/guards/role-type.enum';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      username: 'stephcurry',
      password: '3pointgod',
      role: RoleType.MANAGER,
    },
    {
      id: 2,
      username: 'michaeljordan',
      password: 'thegoat',
      role: RoleType.TECHNICIAN,
    },
    {
      id: 3,
      username: 'lebron',
      password: 'kingjames',
      role: RoleType.TECHNICIAN,
    },
  ];

  findOne(username: string): User {
    const user = this.users.find((user) => user.username === username);

    if (!user) throw new NotFoundException('user not found');

    return user;
  }
}
