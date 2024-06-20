import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { ResponsePagination } from 'src/common/dto/response.dto';

@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createHospitalDto: CreateHospitalDto, @Req() req: any) {
    const user = req.user;
    return this.hospitalsService.create(createHospitalDto, user.sub);
  }

  @Get()
  @HttpCode(HttpStatus.CREATED)
  async findAll() {
    const hospitals = await this.hospitalsService.findAll({
      where: {
        id: {
          not: 14,
        },
      },
    });
    const info = {
      totalCount: hospitals.length,
      perPage: 0,
      totalPages: 1,
      currentPage: 1,
      success: true,
      message: 'Hospitales obtenidos correctamente',
      next: null,
      prev: null,
    };

    return new ResponsePagination<{}>(info, hospitals);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateHospitalDto: UpdateHospitalDto,
  ) {
    return this.hospitalsService.update(+id, updateHospitalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.hospitalsService.remove(+id);
  }

  @Get('select')
  @HttpCode(HttpStatus.OK)
  select() {
    return this.hospitalsService.select();
  }
}
