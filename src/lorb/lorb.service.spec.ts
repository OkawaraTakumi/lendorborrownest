import { Test, TestingModule } from '@nestjs/testing';
import { LorbService } from './lorb.service';

describe('LorbService', () => {
  let service: LorbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LorbService],
    }).compile();

    service = module.get<LorbService>(LorbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
