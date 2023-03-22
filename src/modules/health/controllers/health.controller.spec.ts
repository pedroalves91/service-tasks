import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = app.get<HealthController>(HealthController);
  });

  describe('ping', () => {
    it('should return "pong"', () => {
      expect(controller.check()).toBe('ok');
    });
  });
});
