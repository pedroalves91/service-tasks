import { TasksConsumer } from './tasks.consumer';
import { mock, MockProxy } from 'jest-mock-extended';
import { NotificationsService } from '@notifications/services/notifications.service';
import { NotificationsDto } from '@notifications/services/dtos/notifications.dto';

describe('TasksConsumer Unit Tests', () => {
  let consumer: TasksConsumer;
  let notificationsService: MockProxy<NotificationsService>;

  beforeEach(() => {
    notificationsService = mock<NotificationsService>();
    consumer = new TasksConsumer(notificationsService);
  });

  describe('handlePerformedTask', () => {
    it('should notify manager when handling a performed task', () => {
      consumer.consumeCreatedTaskNotification(
        NotificationsDto.Fixture.newNotification(),
      );

      expect(notificationsService.dispatchNotification).toBeCalled();
    });
  });
});
