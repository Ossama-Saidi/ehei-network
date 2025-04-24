import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { VilleService } from './ville.service';

@Controller('villes')
export class VilleController {
  constructor(private readonly villeService: VilleService) {}

  @Post()
  create(@Body('nom') nom: string) {
    return this.villeService.create({ nom });
  }

  @Get()
  findAll() {
    return this.villeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.villeService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: number, @Body('nom') nom: string) {
    return this.villeService.update(Number(id), { nom });
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.villeService.remove(Number(id));
  }
}
