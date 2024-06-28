import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ComponentesModule } from './componentes/componentes.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { PartidasModule } from './partidas/partidas.module';
import { SurgeriesModule } from './surgeries/surgeries.module';
import { UsersModule } from './users/users.module';
import { CompranetModule } from './compranet/compranet.module';

@Module({
  imports: [
    AuthModule,
    ComponentesModule,
    HospitalsModule,
    PartidasModule,
    SurgeriesModule,
    UsersModule,
    CompranetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
