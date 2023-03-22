import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmOptions } from '../../../config/datasources/type.orm.options';
import { Task } from './models/task.model';
import { JwtMiddleware } from '../../libs/middleware/jwt.middleware';
import { NotificationsModule } from '../notifications/notifications.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { rabbitMQConfig } from '../../../config/datasources/rabbitmq.config';
import { TasksConsumer } from './consumers/tasks.consumer';
import { TasksPublisher } from './publishers/tasks.publisher';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmOptions,
    }),
    TypeOrmModule.forFeature([Task]),
    RabbitMQModule.forRoot(RabbitMQModule, rabbitMQConfig),
    NotificationsModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksPublisher, TasksConsumer],
})
export class TasksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
