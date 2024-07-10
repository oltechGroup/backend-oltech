import { Module } from '@nestjs/common';
import { CompranetService } from './compranet.service';

@Module({
  controllers: [],
  providers: [CompranetService],
  exports: [CompranetService],
})
export class CompranetModule {}
