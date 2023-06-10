import { JwtMetadataDto } from '../../../libs/jwt/jwt-metadata.dto';
import { TasksService } from '../services/tasks.service';
import { TasksController } from './tasks.controller';
import { mock, mockClear, MockProxy } from 'jest-mock-extended';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

describe('TasksController spec', () => {
  let manager: JwtMetadataDto;
  let tech: JwtMetadataDto;
  let tasksService: MockProxy<TasksService>;
  let controller: TasksController;

  beforeEach(() => {
    manager = JwtMetadataDto.Fixture.newManager();
    tech = JwtMetadataDto.Fixture.newTechnician();
    tasksService = mock<TasksService>();
    controller = new TasksController(tasksService);
  });

  afterEach(() => {
    mockClear(tasksService);
  });

  describe('getTasks', () => {
    it('should return all tasks for a manager', async () => {
      const task = {
        id: new ObjectId(),
        summary: 'task',
        userId: 1,
        uuid: '2',
        isCompleted: false,
      };

      tasksService.getTasks.mockResolvedValue([task]);

      const response = await controller.getTasks({
        headers: { user: manager },
      });
      expect(response).toEqual([task]);
    });

    it('should throw exception for a technician', async () => {
      tasksService.getTasks.mockImplementation(() => {
        throw new ForbiddenException();
      });

      let error;
      try {
        await controller.getTasks({
          headers: { user: tech },
        });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(ForbiddenException);
    });
  });

  describe('getTaskById', () => {
    it('should return a task', async () => {
      const task = {
        id: new ObjectId(),
        summary: 'task',
        userId: 1,
        uuid: '2',
        isCompleted: false,
      };

      tasksService.getTaskById.mockResolvedValue(task);

      const response = await controller.getTask(
        {
          headers: { user: manager },
        },
        '1',
      );
      expect(response).toEqual(task);
    });

    it('should throw not found if task does not exist', async () => {
      tasksService.getTaskById.mockImplementation(() => {
        throw new NotFoundException();
      });

      let error;
      try {
        await controller.getTask(
          {
            headers: { user: manager },
          },
          '1',
        );
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(NotFoundException);
    });
  });

  describe('updateTask', () => {
    it('should update a task for a tech and call all external methods', async () => {
      tasksService.updateTask.mockResolvedValue(undefined);

      const taskToUpdate = {
        summary: 'new summary',
      };

      await controller.updateTask(
        {
          headers: { user: manager },
        },
        '1',
        taskToUpdate,
      );
      expect(tasksService.updateTask).toHaveBeenCalledTimes(1);
    });

    it('should throw not found if task does not exist', async () => {
      tasksService.updateTask.mockImplementation(() => {
        throw new NotFoundException();
      });

      const taskToUpdate = {
        summary: 'new summary',
      };

      let error;
      try {
        await controller.updateTask(
          {
            headers: { user: manager },
          },
          '1',
          taskToUpdate,
        );
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(NotFoundException);
    });

    it('should throw exception for a manager', async () => {
      tasksService.updateTask.mockImplementation(() => {
        throw new ForbiddenException();
      });

      const taskToUpdate = {
        summary: 'new summary',
      };

      let error;
      try {
        await controller.updateTask(
          {
            headers: { user: manager },
          },
          '1',
          taskToUpdate,
        );
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(ForbiddenException);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task for a manager and call all external methods', async () => {
      tasksService.deleteTask.mockResolvedValue(undefined);

      await controller.deleteTask(
        {
          headers: { user: manager },
        },
        '1',
      );
      expect(tasksService.deleteTask).toHaveBeenCalledTimes(1);
    });

    it('should throw not found if task does not exist', async () => {
      tasksService.deleteTask.mockImplementation(() => {
        throw new NotFoundException();
      });

      let error;
      try {
        await controller.deleteTask(
          {
            headers: { user: manager },
          },
          '1',
        );
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(NotFoundException);
    });

    it('should throw exception for a technician', async () => {
      tasksService.deleteTask.mockImplementation(() => {
        throw new ForbiddenException();
      });

      let error;
      try {
        await controller.deleteTask(
          {
            headers: { user: manager },
          },
          '1',
        );
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(ForbiddenException);
    });
  });

  describe('createTask', () => {
    it('should create a task for a manager', async () => {
      const task = {
        id: new ObjectId(),
        summary: 'task',
        userId: 1,
        uuid: '1',
        isCompleted: false,
      };

      const newTask = {
        summary: 'task',
      };

      tasksService.createTask.mockResolvedValue(task);

      const response = await controller.createTask(
        {
          headers: { user: manager },
        },
        newTask,
      );
      expect(response).toEqual(task);
    });

    it('should throw exception for a technician', async () => {
      tasksService.createTask.mockImplementation(() => {
        throw new ForbiddenException();
      });

      const newTask = {
        summary: 'task',
      };

      let error;
      try {
        await controller.createTask(
          {
            headers: { user: tech },
          },
          newTask,
        );
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(ForbiddenException);
    });
  });
});
