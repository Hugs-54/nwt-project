import { Test, TestingModule } from '@nestjs/testing';
import { QuizzController } from './quiz.controller';

describe('QuizzController', () => {
  let controller: QuizzController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizzController],
    }).compile();

    controller = module.get<QuizzController>(QuizzController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
