import { Test, TestingModule } from '@nestjs/testing';
import { PartidasService } from './partidas.service';

describe('PartidasService', () => {
  let service: PartidasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartidasService],
    }).compile();

    service = module.get<PartidasService>(PartidasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
