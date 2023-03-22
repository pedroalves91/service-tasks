import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GuardRole } from '../../../libs/guards/guard-role.decorator';
import { RoleType } from '../../../libs/guards/role-type.enum';
import { ManagerGuard } from '../../../libs/guards/manager.guard';
import { TechnicianGuard } from '../../../libs/guards/technician.guard';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TasksService } from '../services/tasks.service';
import { Task } from '../models/task.model';

@Controller('v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @GuardRole(RoleType.MANAGER)
  @UseGuards(ManagerGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  getTasks(@Req() req: any): Promise<Task[]> {
    const userMetadata = req.headers['user'];
    return this.tasksService.getTasks(userMetadata);
  }

  @GuardRole(RoleType.MANAGER, RoleType.TECHNICIAN)
  @UseGuards(ManagerGuard, TechnicianGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getTask(
    @Req() req: any,
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Task> {
    const userMetadata = req.headers['user'];
    return this.tasksService.getTaskById(id, userMetadata);
  }

  @GuardRole(RoleType.TECHNICIAN)
  @UseGuards(TechnicianGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createTask(
    @Req() req: any,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const userMetadata = req.headers['user'];
    return this.tasksService.createTask(createTaskDto, userMetadata);
  }

  @GuardRole(RoleType.TECHNICIAN)
  @UseGuards(TechnicianGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async updateTask(
    @Req() req: any,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<void> {
    const userMetadata = req.headers['user'];
    await this.tasksService.updateTask(id, updateTaskDto, userMetadata);
  }

  @GuardRole(RoleType.MANAGER)
  @UseGuards(ManagerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteTask(
    @Req() req: any,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    const userMetadata = req.headers['user'];
    await this.tasksService.deleteTask(id, userMetadata);
  }
}
