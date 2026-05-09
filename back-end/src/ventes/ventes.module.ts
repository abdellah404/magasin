import { Module } from '@nestjs/common';
import { VentesController } from './ventes.controller';
import { VentesService } from './ventes.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports:     [DatabaseModule],
  controllers: [VentesController],
  providers:   [VentesService],
})
export class VentesModule {}