import { JwtMetadataDto } from '../../../libs/jwt/jwt-metadata.dto';
import { mock, mockClear, MockProxy } from 'jest-mock-extended';
import { Task } from '../models/task.model';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { TasksPublisher } from '../publishers/tasks.publisher';
import { ObjectId } from 'mongodb';

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
      const oid = new ObjectId();
      const task = {
        id: oid,
        summary: 'task',
        userId: 1,
        uuid: '1',
        isCompleted: false,
      };

      tasksRepository.find.mockResolvedValue([task]);
      const response = await service.getTasks(manager);
      expect(response.length).toEqual(1);
      expect(response).toEqual([task]);
    });
  });

  describe('getTaskById', () => {
    it('should return task', async () => {
      const oid = new ObjectId();
      const task = {
        id: oid,
        summary: 'task',
        userId: 1,
        uuid: '1',
        isCompleted: false,
      };

      tasksRepository.findOneBy.mockResolvedValue(task);
      const response = await service.getTaskById('1', manager);
      expect(response).toEqual(task);
    });
  });

  describe('updateTask', () => {
    it('should update task', async () => {
      const oid = new ObjectId();
      const task = {
        id: oid,
        summary: 'task',
        userId: 1,
        uuid: '1',
        isCompleted: false,
      };

      const updateTask = {
        summary: 'new',
      };

      const newTask = {
        id: oid,
        summary: 'new',
        userId: 1,
        uuid: '1',
        isCompleted: false,
      };

      jest.spyOn(service, 'getTaskById').mockResolvedValue(task);
      tasksRepository.merge.mockReturnValueOnce(newTask);
      tasksRepository.save.mockResolvedValue(undefined);

      await service.updateTask('1', updateTask, tech);

      expect(tasksRepository.save).toHaveBeenCalledWith(newTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const oid = new ObjectId();
      const task = {
        id: oid,
        summary: 'task',
        userId: 1,
        uuid: '1',
        isCompleted: false,
      };

      jest.spyOn(service, 'getTaskById').mockResolvedValue(task);
      tasksRepository.softRemove.mockResolvedValue(undefined);
      await service.deleteTask('1', manager);
      expect(tasksRepository.softRemove).toHaveBeenCalledWith(task);
    });
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const newTask = {
        summary: 'new',
      };

      const oid = new ObjectId();
      const createdTask = {
        id: oid,
        summary: 'new',
        userId: 1,
        uuid: '1',
        isCompleted: false,
      };

      tasksRepository.save.mockResolvedValue(createdTask);

      const response = await service.createTask(newTask, manager);
      expect(response).toEqual(createdTask);
    });
  });
});
