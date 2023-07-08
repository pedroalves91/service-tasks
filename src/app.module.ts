import { Module } from '@nestjs/common';
import { HealthModule } from '@health/health.module';
import { AuthModule } from '@auth/auth.module';
import { TasksModule } from '@tasks/tasks.module';

@Module({
  imports: [HealthModule, AuthModule, TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
