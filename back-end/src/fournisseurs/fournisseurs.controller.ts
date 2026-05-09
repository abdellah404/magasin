import { Controller, Get, Post, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { FournisseursService } from './fournisseurs.service';

@Controller('fournisseurs')
export class FournisseursController {

  constructor(private fournisseursService: FournisseursService) {}

  @Get()
  findAll(@Headers('authorization') auth: string) {
    return this.fournisseursService.findAll(auth);
  }

  @Post()
  create(@Body() body: any, @Headers('authorization') auth: string) {
    return this.fournisseursService.create(body, auth);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
    @Headers('authorization') auth: string,
  ) {
    return this.fournisseursService.update(+id, body, auth);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Headers('authorization') auth: string,
  ) {
    return this.fournisseursService.delete(+id, auth);
  }
}