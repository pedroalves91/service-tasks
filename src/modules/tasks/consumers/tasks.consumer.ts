import { Injectable } from '@nestjs/common';
import { NotificationsService } from '@notifications/services/notifications.service';
import { Channel, ConsumeMessage } from 'amqplib';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { props } from '@config/props';
import { NotificationsDto } from '@notifications/services/dtos/notifications.dto';

const errorHandler = (channel: Channel, msg: ConsumeMessage) => {
  // Nacking with requeue: false will send to dead letter exchange.
  channel.nack({ ...msg }, false, false);
};

@Injectable()
export class TasksConsumer {
  constructor(private readonly notificationsService: NotificationsService) {}

  @RabbitSubscribe({
    exchange: props.rabbit.exchanges.task.name,
    routingKey: props.rabbit.exchanges.task.routingKeys.created,
    queue: props.rabbit.exchanges.task.queues.created.name,
    queueOptions: {
      durable: props.rabbit.exchanges.task.queues.created.options.durable,
      deadLetterExchange: props.rabbit.exchanges.task.deadLetterName,
      deadLetterRoutingKey: props.rabbit.exchanges.task.routingKeys.created,
    },
    errorHandler,
  })
  public consumeCreatedTaskNotification(notification: NotificationsDto): void {
    this.notificationsService.dispatchNotification(notification);
  }
}
