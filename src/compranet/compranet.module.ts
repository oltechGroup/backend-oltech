import { Module } from '@nestjs/common';
import { CompranetService } from './compranet.service';
import { CompranetController } from './compranet.controller';

@Module({
  controllers: [CompranetController],
  providers: [CompranetService],
})
export class CompranetModule {}
