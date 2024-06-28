import { Test, TestingModule } from '@nestjs/testing';
import { CompranetService } from './compranet.service';

describe('CompranetService', () => {
  let service: CompranetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompranetService],
    }).compile();

    service = module.get<CompranetService>(CompranetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
