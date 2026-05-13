import { Controller, Get, Put, Body, Headers } from '@nestjs/common';
import { ParametresService } from './parametres.service';

@Controller('parametres')
export class ParametresController {

  constructor(private parametresService: ParametresService) {}


  @Get()
  findOne(@Headers('authorization') auth: string) {
    return this.parametresService.findOne(auth);
  }


  @Put()
  update(@Body() body: any, @Headers('authorization') auth: string) {
    return this.parametresService.update(body, auth);
  }
}