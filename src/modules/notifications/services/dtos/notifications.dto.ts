import { Expose } from 'class-transformer';

export class NotificationsDto {
  @Expose()
  performedByUser: string;

  @Expose()
  performedByUserId: number;

  @Expose()
  taskId: number;

  @Expose()
  performedAt: Date;

  static Fixture = class {
    static newNotification(): NotificationsDto {
      return {
        performedByUser: 'user',
        performedByUserId: 1,
        taskId: 2,
        performedAt: new Date(),
      };
    }
  };
}
