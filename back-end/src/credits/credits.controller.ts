import { Controller, Get, Post, Body, Param, Headers } from '@nestjs/common';
import { CreditsService } from './credits.service';

@Controller('credits')
export class CreditsController {

  constructor(private creditsService: CreditsService) {}


  @Get()
  findAll(@Headers('authorization') auth: string) {
    return this.creditsService.findAll(auth);
  }

  @Post('payer-client/:id')
  payerClient(
    @Param('id') id: string,
    @Body() body: any,
    @Headers('authorization') auth: string,
  ) {
    return this.creditsService.payerClient(+id, body.montant, auth);
  }


  @Post('payer-fourn/:id')
  payerFourn(
    @Param('id') id: string,
    @Body() body: any,
    @Headers('authorization') auth: string,
  ) {
    return this.creditsService.payerFourn(+id, body.montant, auth);
  }
}