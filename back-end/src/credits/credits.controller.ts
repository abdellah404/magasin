import { Controller, Get, Post, Body, Param, Headers } from '@nestjs/common';
import { CreditsService } from './credits.service';

@Controller('credits')
export class CreditsController {

  constructor(private creditsService: CreditsService) {}

  // GET /credits — tous les crédits clients + dettes fournisseurs
  @Get()
  findAll(@Headers('authorization') auth: string) {
    return this.creditsService.findAll(auth);
  }

  // POST /credits/payer-client/:id — payer un crédit client
  @Post('payer-client/:id')
  payerClient(
    @Param('id') id: string,
    @Body() body: any,
    @Headers('authorization') auth: string,
  ) {
    return this.creditsService.payerClient(+id, body.montant, auth);
  }

  // POST /credits/payer-fourn/:id — payer une dette fournisseur
  @Post('payer-fourn/:id')
  payerFourn(
    @Param('id') id: string,
    @Body() body: any,
    @Headers('authorization') auth: string,
  ) {
    return this.creditsService.payerFourn(+id, body.montant, auth);
  }
}