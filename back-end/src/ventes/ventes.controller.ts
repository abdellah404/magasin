import { Controller, Get, Post, Delete, Body, Param, Headers } from '@nestjs/common';
import { VentesService } from './ventes.service';

@Controller('ventes')
export class VentesController {

  constructor(private ventesService: VentesService) {}

  @Get()
  findAll(@Headers('authorization') auth: string) {
    return this.ventesService.findAll(auth);
  }

  @Post()
  create(@Body() body: any, @Headers('authorization') auth: string) {
    return this.ventesService.create(body, auth);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Headers('authorization') auth: string,
  ) {
    return this.ventesService.delete(+id, auth);
  }
}