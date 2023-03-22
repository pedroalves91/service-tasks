import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { props } from '../props';

export const rabbitMQConfig: RabbitMQConfig = {
  uri: `amqp://${props.rabbit.host}:${props.rabbit.port}`,
  connectionInitOptions: { wait: true, timeout: 9992 },
  exchanges: [
    {
      name: props.rabbit.exchanges.task.name,
      options: {
        ...props.rabbit.exchanges.task.options,
      },
    },
  ],
};
