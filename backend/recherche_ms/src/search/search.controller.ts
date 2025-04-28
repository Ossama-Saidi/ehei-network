import { Controller, Get, Param, Post, Body, UsePipes, ValidationPipe, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { SearchService } from './search.service';
import { RechercheDto } from './dto/recherche.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async rechercher(@Body() body: RechercheDto) {
    return this.searchService.rechercher(body.terme, body.utilisateurId);
  }

  @Get('suggest')
async suggestAll(@Query('q') query?: string, @Query('userId', ParseIntPipe) userId?: number) {
  if (!query) return [];
  
  const decodedQuery = decodeURIComponent(query);
  const keepHashtag = decodedQuery.startsWith('#');
  const cleanTerm = keepHashtag ? decodedQuery.slice(1) : decodedQuery;
  
  // Si c'est un hashtag, chercher uniquement dans les tags
  if (keepHashtag) {
    const tagResults = await this.searchService.searchTags(cleanTerm);
    return tagResults.map(tag => ({
      ...tag,
      displayName: `#${tag.nom}`,
      type: 'tag'
    }));
  } 
  
  // Sinon, chercher dans tous les types de données
  const [users, tags] = await Promise.all([
    this.searchService.searchUsers(cleanTerm),
    this.searchService.searchTags(cleanTerm)
  ]);
  
  // Formatage des résultats utilisateurs
  const formattedUsers = users.map(user => ({
    ...user,
    displayName: `${user.prenom} ${user.nom}`,
    type: 'user'
  }));
  
  // Formatage des résultats tags
  const formattedTags = tags.map(tag => ({
    ...tag,
    displayName: `#${tag.nom}`,
    type: 'tag'
  }));
  
  // Combiner les résultats
  return [...formattedUsers, ...formattedTags];
}
  
  @Get('/history/:userId')
  async getHistorique(@Param('userId', ParseIntPipe) utilisateurId: number) {
    return this.searchService.getDernieresRecherches(utilisateurId);
  }

  @Get('/history/all/:userId')
  async getHistoriqueComplet(@Param('userId', ParseIntPipe) utilisateurId: number) {
    return this.searchService.getHistoriqueComplet(utilisateurId);
  }

  @Delete('/history/:userId')
  async clearHistorique(@Param('userId', ParseIntPipe) utilisateurId: number) {
    return this.searchService.clearHistorique(utilisateurId);
  }

  @Delete('/history/:userId/:id')
  async deleteSearchItem(
    @Param('userId', ParseIntPipe) utilisateurId: number,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.searchService.deleteSearchItem(utilisateurId, id);
  }

}
