import { Test, TestingModule } from '@nestjs/testing';
import { SurgeriesService } from './surgeries.service';

describe('SurgeriesService', () => {
  let service: SurgeriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurgeriesService],
    }).compile();

    service = module.get<SurgeriesService>(SurgeriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
