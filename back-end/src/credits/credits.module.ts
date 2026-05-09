import { Module } from '@nestjs/common';
import { CreditsController } from './credits.controller';
import { CreditsService } from './credits.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports:     [DatabaseModule],
  controllers: [CreditsController],
  providers:   [CreditsService],
})
export class CreditsModule {}