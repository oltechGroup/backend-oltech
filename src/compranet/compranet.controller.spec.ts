import { Test, TestingModule } from '@nestjs/testing';
import { CompranetController } from './compranet.controller';
import { CompranetService } from './compranet.service';

describe('CompranetController', () => {
  let controller: CompranetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompranetController],
      providers: [CompranetService],
    }).compile();

    controller = module.get<CompranetController>(CompranetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
