import { Injectable } from '@nestjs/common';
import { Logger as Log } from '@nestjs/common';
import { NotificationsDto } from './dtos/notifications.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Log();

  dispatchNotification(notification: NotificationsDto): void {
    const { performedByUser, performedByUserId, taskId, performedAt } =
      notification;

    this.logger.log(
      `The tech ${performedByUser} with id ${performedByUserId} performed the task ${taskId} on date ${performedAt}`,
    );
  }
}
