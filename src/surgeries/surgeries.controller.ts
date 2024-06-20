import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SurgeriesService } from './surgeries.service';
import { CreateSurgeryDto } from './dto/create-surgery.dto';
import { UpdateSurgeryDto } from './dto/update-surgery.dto';
import { surgeries as SurgeryModel } from '@prisma/client';

@Controller('surgeries')
export class SurgeriesController {
  constructor(private readonly surgeriesService: SurgeriesService) {}

  @Post()
  create(@Body() createSurgeryDto: CreateSurgeryDto) {
    return this.surgeriesService.create(createSurgeryDto);
  }

  @Get()
  async findAll(): Promise<SurgeryModel[]> {
    return this.surgeriesService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surgeriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSurgeryDto: UpdateSurgeryDto) {
    return this.surgeriesService.update(+id, updateSurgeryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.surgeriesService.remove(+id);
  }
}
