import { Module } from '@nestjs/common';
import { ComponentesService } from './componentes.service';
import { ComponentesController } from './componentes.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ComponentesController],
  providers: [ComponentesService, PrismaService],
})
export class ComponentesModule {}
