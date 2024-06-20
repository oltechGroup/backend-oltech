import { Test, TestingModule } from '@nestjs/testing';
import { ComponentesController } from './componentes.controller';
import { ComponentesService } from './componentes.service';

describe('ComponentesController', () => {
  let controller: ComponentesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComponentesController],
      providers: [ComponentesService],
    }).compile();

    controller = module.get<ComponentesController>(ComponentesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
