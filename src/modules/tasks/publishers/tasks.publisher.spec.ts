import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { props } from '../../../../config/props';
import { mock, MockProxy } from 'jest-mock-extended';
import { TasksPublisher } from './tasks.publisher';
import { NotificationsDto } from '../../notifications/services/dtos/notifications.dto';

describe('TasksPublisher spec', () => {
  let publisher: TasksPublisher;
  let amqpConnection: MockProxy<AmqpConnection>;

  beforeEach(() => {
    amqpConnection = mock<AmqpConnection>();
    publisher = new TasksPublisher(amqpConnection);
  });

  describe('publishCreatedTask', () => {
    it('should publish notification', async () => {
      const createdTask = NotificationsDto.Fixture.newNotification();
      await publisher.publishCreatedTask(createdTask);
      amqpConnection.publish.calledWith(
        props.rabbit.exchanges.task.name,
        props.rabbit.exchanges.task.routingKeys.created,
        createdTask,
      );
    });
  });
});
