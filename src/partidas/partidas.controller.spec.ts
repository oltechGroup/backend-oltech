import { Test, TestingModule } from '@nestjs/testing';
import { PartidasController } from './partidas.controller';
import { PartidasService } from './partidas.service';

describe('PartidasController', () => {
  let controller: PartidasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartidasController],
      providers: [PartidasService],
    }).compile();

    controller = module.get<PartidasController>(PartidasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
