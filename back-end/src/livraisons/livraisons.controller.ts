import { Controller, Get, Post, Delete, Body, Param, Headers } from '@nestjs/common';
import { LivraisonsService } from './livraisons.service';

@Controller('livraisons')
export class LivraisonsController {

  constructor(private livraisonsService: LivraisonsService) {}

  @Get()
  findAll(@Headers('authorization') auth: string) {
    return this.livraisonsService.findAll(auth);
  }

  @Post()
  create(@Body() body: any, @Headers('authorization') auth: string) {
    return this.livraisonsService.create(body, auth);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Headers('authorization') auth: string,
  ) {
    return this.livraisonsService.delete(+id, auth);
  }
}