import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { FournisseursModule } from './fournisseurs/fournisseurs.module';
import { ProduitsModule } from './produits/produits.module';
import { VentesModule } from './ventes/ventes.module';
import { LivraisonsModule } from './livraisons/livraisons.module';
import { CreditsModule } from './credits/credits.module';
import { ParametresModule } from './parametres/parametres.module';

@Module({
  imports: [DatabaseModule, AuthModule, ClientsModule, FournisseursModule, ProduitsModule, VentesModule, LivraisonsModule, CreditsModule, ParametresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
