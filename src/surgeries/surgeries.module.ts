import { Module } from '@nestjs/common';
import { SurgeriesService } from './surgeries.service';
import { SurgeriesController } from './surgeries.controller';
import { PrismaService } from 'src/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  controllers: [SurgeriesController],
  providers: [SurgeriesService, PrismaService,  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },],
})

export class SurgeriesModule {}
