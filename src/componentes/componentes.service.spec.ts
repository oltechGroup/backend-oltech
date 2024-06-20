import { Test, TestingModule } from '@nestjs/testing';
import { ComponentesService } from './componentes.service';

describe('ComponentesService', () => {
  let service: ComponentesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComponentesService],
    }).compile();

    service = module.get<ComponentesService>(ComponentesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
