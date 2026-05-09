import { Controller, Get, Put, Body, Headers } from '@nestjs/common';
import { ParametresService } from './parametres.service';

@Controller('parametres')
export class ParametresController {

  constructor(private parametresService: ParametresService) {}

  // GET /parametres — récupérer les infos du user connecté
  @Get()
  findOne(@Headers('authorization') auth: string) {
    return this.parametresService.findOne(auth);
  }

  // PUT /parametres — modifier les infos du user connecté
  @Put()
  update(@Body() body: any, @Headers('authorization') auth: string) {
    return this.parametresService.update(body, auth);
  }
}