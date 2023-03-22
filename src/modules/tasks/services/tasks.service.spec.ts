import { JwtMetadataDto } from '../../../libs/jwt/jwt-metadata.dto';
import { mock, mockClear, MockProxy } from 'jest-mock-extended';
import { Task } from '../models/task.model';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { TasksPublisher } from '../publishers/tasks.publisher';

describe('TasksService spec', () => {
  let manager: JwtMetadataDto;
  let tech: JwtMetadataDto;
  let tasksRepository: MockProxy<Repository<Task>>;
  let tasksPublisher: MockProxy<TasksPublisher>;
  let service: TasksService;

  beforeEach(() => {
    manager = JwtMetadataDto.Fixture.newManager();
    tech = JwtMetadataDto.Fixture.newTechnician();
    tasksRepository = mock<Repository<Task>>();
    tasksPublisher = mock<TasksPublisher>();
    service = new TasksService(tasksRepository, tasksPublisher);
  });

  afterEach(() => {
    mockClear(tasksRepository);
  });

  describe('getTasks', () => {
    it('should return all tasks', async () => {
      const task = {
        id: 1,
        summary: 'task',
        userId: 1,
      };

      tasksRepository.find.mockResolvedValue([task]);
      const response = await service.getTasks(manager);
      expect(response.length).toEqual(1);
      expect(response).toEqual([task]);
    });
  });

  describe('getTaskById', () => {
    it('should return task', async () => {
      const task = {
        id: 1,
        summary: 'task',
        userId: 1,
      };

      tasksRepository.findOneBy.mockResolvedValue(task);
      const response = await service.getTaskById(1, manager);
      expect(response).toEqual(task);
    });
  });

  describe('updateTask', () => {
    it('should update task', async () => {
      const task = {
        id: 1,
        summary: 'task',
        userId: 1,
      };

      const updateTask = {
        summary: 'new',
      };

      const newTask = {
        id: 1,
        summary: 'new',
        userId: 1,
      };

      jest.spyOn(service, 'getTaskById').mockResolvedValue(task);
      tasksRepository.merge.mockReturnValueOnce(newTask);
      tasksRepository.save.mockResolvedValue(undefined);

      await service.updateTask(1, updateTask, tech);

      expect(tasksRepository.save).toHaveBeenCalledWith(newTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const task = {
        id: 1,
        summary: 'task',
        userId: 1,
      };

      jest.spyOn(service, 'getTaskById').mockResolvedValue(task);
      tasksRepository.softRemove.mockResolvedValue(undefined);
      await service.deleteTask(1, manager);
      expect(tasksRepository.softRemove).toHaveBeenCalledWith(task);
    });
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const newTask = {
        summary: 'new',
      };

      const createdTask = {
        id: 1,
        summary: 'new',
        userId: 1,
      };

      tasksRepository.save.mockResolvedValue(createdTask);

      const response = await service.createTask(newTask, manager);
      expect(response).toEqual(createdTask);
    });
  });
});