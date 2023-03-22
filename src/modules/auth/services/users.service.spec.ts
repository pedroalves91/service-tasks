import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService spec', () => {
  let usersService: UsersService;

  beforeEach(() => {
    usersService = new UsersService();
  });

  describe('findOne', () => {
    it('should return user if it exists', () => {
      const username = 'stephcurry';

      const user = usersService.findOne(username);

      expect(user).toBeDefined();
    });

    it('should throw not found if user does not exists', () => {
      const username = 'fake';

      let error;
      try {
        usersService.findOne(username);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(NotFoundException);
    });
  });
});
