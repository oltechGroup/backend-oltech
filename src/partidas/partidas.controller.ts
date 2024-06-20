import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PartidasService } from './partidas.service';
import { CreatePartidaDto } from './dto/create-partida.dto';
import { UpdatePartidaDto } from './dto/update-partida.dto';

@Controller('partidas')
export class PartidasController {
  constructor(private readonly partidasService: PartidasService) {}

  @Post()
  create(@Body() createPartidaDto: CreatePartidaDto) {
    return this.partidasService.create(createPartidaDto);
  }

  @Get()
  findAll() {
    return this.partidasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partidasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartidaDto: UpdatePartidaDto) {
    return this.partidasService.update(+id, updatePartidaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partidasService.remove(+id);
  }
}
