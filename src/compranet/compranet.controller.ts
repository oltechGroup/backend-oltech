import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompranetService } from './compranet.service';
import { CreateCompranetDto } from './dto/create-compranet.dto';
import { UpdateCompranetDto } from './dto/update-compranet.dto';

@Controller('compranet')
export class CompranetController {
  constructor(private readonly compranetService: CompranetService) {}

  @Get()
  findAll() {
    return this.compranetService.findAllProcedimientos();
  }
}
