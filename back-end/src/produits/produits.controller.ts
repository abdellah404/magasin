import { Controller, Get, Post, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { ProduitsService } from './produits.service';

@Controller('produits')
export class ProduitsController {

  constructor(private produitsService: ProduitsService) {}

  @Get()
  findAll(@Headers('authorization') auth: string) {
    return this.produitsService.findAll(auth);
  }

  @Post()
  create(@Body() body: any, @Headers('authorization') auth: string) {
    return this.produitsService.create(body, auth);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
    @Headers('authorization') auth: string,
  ) {
    return this.produitsService.update(+id, body, auth);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Headers('authorization') auth: string,
  ) {
    return this.produitsService.delete(+id, auth);
  }
}