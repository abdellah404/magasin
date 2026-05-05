import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService], // ← important : permet à auth d'utiliser DatabaseService
})
export class DatabaseModule {}
