import { Test, TestingModule } from '@nestjs/testing';
import { LorbController } from './lorb.controller';

describe('LorbController', () => {
  let controller: LorbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LorbController],
    }).compile();

    controller = module.get<LorbController>(LorbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
