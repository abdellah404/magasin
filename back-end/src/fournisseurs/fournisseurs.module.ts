import { Module } from '@nestjs/common';
import { FournisseursController } from './fournisseurs.controller';
import { FournisseursService } from './fournisseurs.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports:     [DatabaseModule],
  controllers: [FournisseursController],
  providers:   [FournisseursService],
})
export class FournisseursModule {}