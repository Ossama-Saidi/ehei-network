import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query } from '@nestjs/common';
import { PublicationSavesService } from './publication-saves.service';
import { savePublicationDto } from './dto/save-publication.dto';

@Controller('publication-saves')
export class PublicationSavesController {
  constructor(private readonly publicationSavesService: PublicationSavesService) {}
  @Post('save')
  async savePublication(
    @Body() savePublicationDto: savePublicationDto,
  ) {
    try {
      return await this.publicationSavesService.savePublication(
        savePublicationDto.id_publication,
        savePublicationDto.id_user
      );
    } catch (error) {
      if (error.message === 'Publication not found' || 
          error.message === 'Publication already saved by this user') {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to save publication.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Delete('save')
  async removeSavedPublication(
    @Body() savePublicationDto: savePublicationDto,
  ) {
    try {
      return await this.publicationSavesService.removeSavedPublication(
        savePublicationDto.id_publication,
        savePublicationDto.id_user
      );
    } catch (error) {
      if (error.message === 'Publication not saved by this user') {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to remove saved publication.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Get('saves/:id_user')
  async getUserSavedPublications(
    @Param('id_user') id_user: number,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('includeDetails') includeDetails?: boolean,
    @Query('sortBy') sortBy?: 'recent' | 'oldest' | 'relevant'

  ) {
    try {
      return await this.publicationSavesService.getUserSavedPublications(
        +id_user,
        {
          skip: skip ? +skip : undefined,
          take: take ? +take : undefined,
          includePublicationDetails: includeDetails !== undefined ? includeDetails === true : undefined,
          sortBy: sortBy
        }
      );
    } catch (error) {
      throw new HttpException('Failed to retrieve saved publications.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
