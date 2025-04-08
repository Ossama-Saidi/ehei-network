import { Controller, Get, Param, Post, Body, UsePipes, ValidationPipe, Delete, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { RechercheDto } from './dto/recherche.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('suggest')
  async suggestTags(
    @Query('q') query?: string,
    @Query('userId') userId?: number
  ) {
    if (!query) return [];
    
    // Décodage du terme de recherche (gère les caractères spéciaux comme #)
    const decodedQuery = decodeURIComponent(query);
    
    // Nettoyage du terme (conserve le # si présent)
    const keepHashtag = decodedQuery.startsWith('#');
    const cleanTerm = keepHashtag ? decodedQuery : decodedQuery;
    
    const results = await this.searchService.suggestTags(cleanTerm);
    
    // Formatage des résultats (ajoute le # si nécessaire)
    return results.map(tag => ({
      ...tag,
      displayName: keepHashtag ? `#${tag.nom}` : tag.nom
    }));
  }
  
  @Get('/history/:userId')
  async getHistorique(@Param('userId') utilisateurId: number) {
    return this.searchService.getDernieresRecherches(utilisateurId);
  }

  @Get('/history/all/:userId')
  async getHistoriqueComplet(@Param('userId') utilisateurId: number) {
    return this.searchService.getHistoriqueComplet(utilisateurId);
  }

  @Delete('/history/:userId')
  async clearHistorique(@Param('userId') utilisateurId: number) {
    return this.searchService.clearHistorique(utilisateurId);
  }

  @Delete('/history/:userId/:id')
  async deleteSearchItem(
    @Param('userId') utilisateurId: number,
    @Param('id') id: number
  ) {
    return this.searchService.deleteSearchItem(utilisateurId, id);
  }

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async rechercher(@Body() body: RechercheDto) {
    return this.searchService.rechercher(body.terme, body.utilisateurId);
  }
}