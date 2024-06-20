import { Test, TestingModule } from '@nestjs/testing';
import { HospitalsController } from './hospitals.controller';
import { HospitalsService } from './hospitals.service';

describe('HospitalsController', () => {
  let controller: HospitalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HospitalsController],
      providers: [HospitalsService],
    }).compile();

    controller = module.get<HospitalsController>(HospitalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
