import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  Logger as Log,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from '../models/task.model';
import { CreateTaskDto } from '../controllers/dtos/create-task.dto';
import { UpdateTaskDto } from '../controllers/dtos/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtMetadataDto } from '../../../libs/jwt/jwt-metadata.dto';
import { TasksPublisher } from '../publishers/tasks.publisher';
import { RoleType } from '../../../libs/guards/role-type.enum';
import { v4 as uuidv4 } from 'uuid';

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
      uuid: uuidv4(),
      userId: userMetadata.id,
    });

    await this.tasksPublisher.publishCreatedTask({
      performedByUser: userMetadata.username,
      performedByUserId: userMetadata.id,
      taskId: createdTask.uuid,
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

  async getTaskById(uuid: string, userMetadata: JwtMetadataDto): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ uuid });

    if (!task) throw new NotFoundException('task not found');
    if (userMetadata.role === RoleType.TECHNICIAN) {
      this.hasAccessToTask(task.userId, userMetadata.id);
    }
    return task;
  }

  async updateTask(
    uuid: string,
    updateTaskDto: UpdateTaskDto,
    userMetadata: JwtMetadataDto,
  ): Promise<void> {
    Log.log(
      `${userMetadata.role} ${userMetadata.username} with id ${userMetadata.id} is updating a task`,
    );

    const originalTask = await this.getTaskById(uuid, userMetadata);

    const mergedTask = {
      ...originalTask,
      ...updateTaskDto,
    };
    await this.tasksRepository.save(mergedTask);
  }

  async deleteTask(uuid: string, userMetadata: JwtMetadataDto): Promise<void> {
    Log.log(
      `${userMetadata.role} ${userMetadata.username} with id ${userMetadata.id} is deleting a task`,
    );

    const originalTask = await this.getTaskById(uuid, userMetadata);
    await this.tasksRepository.softRemove(originalTask);
  }

  async markCompleteTask(
    uuid: string,
    userMetadata: JwtMetadataDto,
  ): Promise<void> {
    Log.log(
      `${userMetadata.role} ${userMetadata.username} with id ${userMetadata.id} is marking a task completed`,
    );

    const originalTask = await this.getTaskById(uuid, userMetadata);

    if (originalTask.isCompleted) {
      throw new BadRequestException('This task is already completed');
    }

    await this.tasksRepository.save({
      ...originalTask,
      isCompleted: true,
    });
  }

  async markIncompleteTask(
    uuid: string,
    userMetadata: JwtMetadataDto,
  ): Promise<void> {
    Log.log(
      `${userMetadata.role} ${userMetadata.username} with id ${userMetadata.id} is marking a task incomplete`,
    );

    const originalTask = await this.getTaskById(uuid, userMetadata);

    if (!originalTask.isCompleted) {
      throw new BadRequestException('This task is already uncompleted');
    }

    await this.tasksRepository.save({
      ...originalTask,
      isCompleted: false,
    });
  }

  private hasAccessToTask(taskUserId: number, userId: number): void {
    if (taskUserId !== userId)
      throw new ForbiddenException('You dont have access to this task');
  }
}
