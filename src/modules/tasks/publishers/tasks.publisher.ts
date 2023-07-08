import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { props } from '@config/props';
import { NotificationsDto } from '@notifications/services/dtos/notifications.dto';

@Injectable()
export class TasksPublisher {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  public publishCreatedTask(
    createdTaskNotification: NotificationsDto,
  ): Promise<void> {
    return this.amqpConnection.publish(
      props.rabbit.exchanges.task.name,
      props.rabbit.exchanges.task.routingKeys.created,
      createdTaskNotification,
    );
  }
}
