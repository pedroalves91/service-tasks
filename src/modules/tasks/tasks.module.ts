import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './models/task.model';
import { JwtMiddleware } from '../../libs/middleware/jwt.middleware';
import { NotificationsModule } from '../notifications/notifications.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { rabbitMQConfig } from '../../../config/datasources/rabbitmq.config';
import { TasksConsumer } from './consumers/tasks.consumer';
import { TasksPublisher } from './publishers/tasks.publisher';
import { MongoOrmOptions } from '../../../config/datasources/mongo.orm.options';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: MongoOrmOptions,
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
