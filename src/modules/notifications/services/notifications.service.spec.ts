import { NotificationsDto } from './dtos/notifications.dto';
import { NotificationsService } from './notifications.service';
import { Logger } from '@nestjs/common';

describe('NotificationsService spec', () => {
  let notificationsService: NotificationsService;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    loggerSpy = jest.spyOn(Logger.prototype, 'log');
    notificationsService = new NotificationsService();
  });

  afterEach(() => {
    loggerSpy.mockClear();
  });

  describe('dispatchNotification', () => {
    it('should log a message with the notification details', () => {
      const notification: NotificationsDto = {
        performedByUser: 'user',
        performedByUserId: 1,
        taskId: '2',
        performedAt: new Date(),
      };

      notificationsService.dispatchNotification(notification);

      expect(loggerSpy).toHaveBeenCalledWith(
        `The tech ${notification.performedByUser} with id ${notification.performedByUserId} performed the task ${notification.taskId} on date ${notification.performedAt}`
      );
    });
  });
});
