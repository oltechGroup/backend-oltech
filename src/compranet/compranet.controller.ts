import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompranetService } from './compranet.service';
import { CreateCompranetDto } from './dto/create-compranet.dto';
import { UpdateCompranetDto } from './dto/update-compranet.dto';

@Controller('compranet')
export class CompranetController {
  constructor(private readonly compranetService: CompranetService) {}

  @Post()
  create(@Body() createCompranetDto: CreateCompranetDto) {
    return this.compranetService.create(createCompranetDto);
  }

  @Get()
  findAll() {
    return this.compranetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.compranetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompranetDto: UpdateCompranetDto) {
    return this.compranetService.update(+id, updateCompranetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.compranetService.remove(+id);
  }
}
