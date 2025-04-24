import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('controller')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Récupère tous les exemples' })
  @ApiResponse({ status: 200, description: 'Liste de tous les éléments récupérée avec succès' })
  getHello(): string {
    return this.appService.getHello();
  }
}
