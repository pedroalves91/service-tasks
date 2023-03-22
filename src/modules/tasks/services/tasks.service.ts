import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  Logger as Log,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from '../models/task.model';
import { CreateTaskDto } from '../controllers/dtos/create-task.dto';
import { UpdateTaskDto } from '../controllers/dtos/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtMetadataDto } from '../../../libs/jwt/jwt-metadata.dto';
import { TasksPublisher } from '../publishers/tasks.publisher';
import { RoleType } from '../../../libs/guards/role-type.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
    private readonly tasksPublisher: TasksPublisher,
  ) {}

  async createTask(
    createTaskDto: CreateTaskDto,
    userMetadata: JwtMetadataDto,
  ): Promise<Task> {
    Log.log(
      `${userMetadata.role} ${userMetadata.username} with id ${userMetadata.id} is creating a new task`,
    );

    const createdTask = await this.tasksRepository.save({
      ...createTaskDto,
      userId: userMetadata.id,
    });

    await this.tasksPublisher.publishCreatedTask({
      performedByUser: userMetadata.username,
      performedByUserId: userMetadata.id,
      taskId: createdTask.id,
      performedAt: new Date(),
    });

    return createdTask;
  }

  getTasks(userMetadata: JwtMetadataDto): Promise<Task[]> {
    Log.log(
      `${userMetadata.role} ${userMetadata.username} with id ${userMetadata.id} is getting all tasks`,
    );

    return this.tasksRepository.find();
  }

  async getTaskById(id: number, userMetadata: JwtMetadataDto): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });

    if (!task) throw new NotFoundException('task not found');
    if (userMetadata.role === RoleType.TECHNICIAN) {
      this.hasAccessToTask(task.userId, userMetadata.id);
    }
    return task;
  }

  async updateTask(
    id: number,
    updateTaskDto: UpdateTaskDto,
    userMetadata: JwtMetadataDto,
  ): Promise<void> {
    Log.log(
      `${userMetadata.role} ${userMetadata.username} with id ${userMetadata.id} is updating a task`,
    );

    const originalTask = await this.getTaskById(id, userMetadata);
    this.hasAccessToTask(originalTask.userId, userMetadata.id);

    const mergedTask = {
      ...originalTask,
      ...updateTaskDto,
    };
    await this.tasksRepository.save(mergedTask);
  }

  async deleteTask(id: number, userMetadata: JwtMetadataDto): Promise<void> {
    Log.log(
      `${userMetadata.role} ${userMetadata.username} with id ${userMetadata.id} is deleting a task`,
    );

    const originalTask = await this.getTaskById(id, userMetadata);
    await this.tasksRepository.softRemove(originalTask);
  }

  private hasAccessToTask(taskUserId: number, userId: number): void {
    if (taskUserId !== userId)
      throw new ForbiddenException('You dont have access to this task');
  }
}
