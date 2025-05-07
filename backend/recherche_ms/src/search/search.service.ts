import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { UserCacheService } from 'src/users/user-cache.service';

@Injectable()
export class SearchService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Gardez cette ligne car vous l'utilisez ailleurs
    private userCacheService: UserCacheService,
  ) {}
  
async rechercher(terme: string, utilisateurId: number) {
  const cacheKey = `search_${terme}`;
  const cached = await this.cacheManager.get<any>(cacheKey);
  if (cached) return cached;

  const { isHashtag, cleanTerm, hashtags } = this.analyzeSearchTerm(terme);
  
  const [utilisateurs, groupes, tags] = await Promise.all([
    this.searchUsers(cleanTerm),
    this.searchGroups(cleanTerm),
    this.searchTags(hashtags.length > 0 ? hashtags[0] : cleanTerm),
  ]);

  const result = { utilisateurs, groupes, tags };
  await this.cacheResults(cacheKey, result);
  await this.saveSearchHistory(utilisateurId, terme, result);

  return result;
}

  analyzeSearchTerm(term: string) {
    const isHashtag = term.startsWith('#');
    const cleanTerm = isHashtag ? term.slice(1) : term;
    const hashtags = this.extractHashtags(term);
    
    return { 
      isHashtag, 
      cleanTerm, 
      hashtags: [...new Set(hashtags)], // Élimine les doublons
    };
  }

  extractHashtags(text: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    const matches: string[] = [];
    let match;
    
    while ((match = hashtagRegex.exec(text)) !== null) {
      matches.push(match[1]);
    }

    return matches;
  }

  async searchUsers(term: string) {
    // Rechercher même avec un seul caractère
  if (!term) return [];
  
  const lowerTerm = term.toLowerCase().trim();
  console.log('Searching for term:', lowerTerm);

  // Utiliser directement UserCacheService
  const allUsers = this.userCacheService.getAllUsers();
  console.log(`Found ${allUsers.length} users in cache`);
  
  const matchedUsers = allUsers.filter(user => {
    const nom = (user.nom || '').toLowerCase();
    const prenom = (user.prenom || '').toLowerCase();
    const nomComplet = (user.nomComplet || '').toLowerCase();
    
    // Cherche si le terme est présent au début d'un nom ou prénom
    return nom.startsWith(lowerTerm) || 
           prenom.startsWith(lowerTerm) || 
           nomComplet.startsWith(lowerTerm) ||
           nom.includes(lowerTerm) ||
           prenom.includes(lowerTerm) ||
           nomComplet.includes(lowerTerm);
  });

  console.log(`Found ${matchedUsers.length} matched users`);

  return matchedUsers.map(user => ({
    id: user.id,
    nom: user.nom,
    prenom: user.prenom,
    nomComplet: user.nomComplet,
    type: 'user'
  })).slice(0, 5);
}
  

  async searchGroups(term: string) {
    if (!term || term.length < 1) return [];
    
    const groupes = await this.cacheManager.get<any[]>('groupes_cache');
    if (!groupes) return [];
    
    return groupes.filter(groupe => groupe.nom?.toLowerCase().includes(term.toLowerCase())).slice(0, 5);
  }

  async searchTags(term: string): Promise<any[]> {
    if (!term?.trim() || term.trim().length < 2) return [];

    try {
      const cacheKey = `tags_${term}`;
      const cached = await this.cacheManager.get<any[]>(cacheKey);
      if (cached) return cached;

      const allTags = await this.cacheManager.get<any[]>('tags_cache');
      if (!allTags) return [];

      const results = allTags.filter(tag =>
        tag.nom?.toLowerCase().includes(term.toLowerCase()) ||
        (tag.variations && tag.variations.includes(term))
      ).sort((a, b) => (b.occurrences || 0) - (a.occurrences || 0)).slice(0, 10);

      await this.cacheManager.set(cacheKey, results, 30);
      return results;
    } catch (error) {
      console.error('Erreur dans searchTags() :', error);
      throw new Error('Échec de la recherche de tags');
    }
  }

  async cacheResults(key: string, data: any) {
    await this.cacheManager.set(key, data, data.tags?.length ? 3600000 : 600000);
  }

  async saveSearchHistory(
    userId: number,
    term: string,
    results: { [key: string]: any[] }
  ) {
    const hasResults = Object.values(results).some((arr: any[]) => arr.length > 0);

    await this.prisma.search.create({
      data: {
        utilisateurId: userId,
        terme: term,
        statut: hasResults ? 'trouvé' : 'non_trouvé',
        dateRecherche: new Date()
      }
    });
  }

  async getDernieresRecherches(utilisateurId: number) {
    return this.prisma.search.findMany({
      where: { utilisateurId },
      orderBy: { dateRecherche: 'desc' },
      take: 5,
      select: {
        id: true,
        terme: true,
        resultatId: true,
        type: true,
        dateRecherche: true,
      }
    });
  }

  async getHistoriqueComplet(utilisateurId: number) {
    return this.prisma.search.findMany({
      where: { utilisateurId },
      orderBy: { dateRecherche: 'desc' },
    });
  }

  async clearHistorique(utilisateurId: number) {
    return this.prisma.search.deleteMany({
      where: { utilisateurId },
    });
  }

  async deleteSearchItem(utilisateurId: number, id: number) {
    return this.prisma.search.deleteMany({
      where: { id, utilisateurId },
    });
  }
}