import { Controller, Get, Post, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {

  constructor(private clientsService: ClientsService) {}

  @Get()
  findAll(@Headers('authorization') auth: string) {
    return this.clientsService.findAll(auth);
  }

  @Post()
  create(@Body() body: any, @Headers('authorization') auth: string) {
    return this.clientsService.create(body, auth);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
    @Headers('authorization') auth: string,
  ) {
    return this.clientsService.update(+id, body, auth);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Headers('authorization') auth: string,
  ) {
    return this.clientsService.delete(+id, auth);
  }
}