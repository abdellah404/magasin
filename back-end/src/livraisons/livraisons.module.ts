import { Module } from '@nestjs/common';
import { LivraisonsController } from './livraisons.controller';
import { LivraisonsService } from './livraisons.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports:     [DatabaseModule],
  controllers: [LivraisonsController],
  providers:   [LivraisonsService],
})
export class LivraisonsModule {}