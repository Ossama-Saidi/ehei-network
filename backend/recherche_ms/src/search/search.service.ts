import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOperator, FindOptionsOrder } from 'typeorm';
import { Search } from './entities/search.entity';
import { User } from './entities/user.entity';
import { Groupe } from './entities/groupe.entity';
import { Tag } from './entities/tag.entity';
import { Publication } from './entities/publication.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { TagService } from './tag.service';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Search) private searchRepo: Repository<Search>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Groupe) private groupeRepo: Repository<Groupe>,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
    @InjectRepository(Publication) private publicationRepo: Repository<Publication>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private tagService: TagService,
  ) {}

  async rechercher(terme: string, utilisateurId: number) {
    const cacheKey = `search_${terme}`;
    const cached = await this.cacheManager.get<any>(cacheKey);
    if (cached) return cached;

    const { isHashtag, cleanTerm, hashtags } = this.analyzeSearchTerm(terme);
    
    const [utilisateurs, groupes, publications, tags] = await Promise.all([
      this.searchUsers(cleanTerm),
      this.searchGroups(cleanTerm),
      this.searchPublications(terme, hashtags),
      this.searchTags(hashtags.length > 0 ? hashtags[0] : cleanTerm)
    ]);

    await this.updateTagPopularity(tags);
    
    const result = { utilisateurs, groupes, publications, tags };
    await this.cacheResults(cacheKey, result);
    await this.saveSearchHistory(utilisateurId, terme, result);

    return result;
  }

  private analyzeSearchTerm(term: string) {
    const isHashtag = term.startsWith('#');
    const cleanTerm = isHashtag ? term.slice(1) : term;
    const hashtags = this.extractHashtags(term);
    
    return { 
      isHashtag, 
      cleanTerm, 
      hashtags: [...new Set(hashtags)] // Élimine les doublons
    };
  }

  private extractHashtags(text: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    const matches: string[] = [];
    let match;
    
    while ((match = hashtagRegex.exec(text)) !== null) {
      matches.push(match[1]);
    }

    return matches;
  }

  private async searchUsers(term: string) {
    if (!term || term.length < 1) return [];
    return this.userRepo.find({ 
      where: { nom: Like(`%${term}%`) },
      take: 5
    });
  }

  private async searchGroups(term: string) {
    if (!term || term.length < 1) return [];
    return this.groupeRepo.find({ 
      where: { nom: Like(`%${term}%`) },
      take: 5
    });
  }

  private async searchPublications(term: string, hashtags: string[]) {
    const whereConditions: Array<{ contenu: FindOperator<string> }> = [];
    
    // Recherche dans le texte
    if (term) {
      whereConditions.push({ contenu: Like(`%${term}%`) });
      
      // Recherche des hashtags similaires
      const similarTags = await this.tagService.searchTags(term);
      similarTags.forEach(tag => {
        whereConditions.push({ contenu: Like(`%#${tag.nom}%`) });
      });
    }

    // Recherche des hashtags explicites
    hashtags.forEach(tag => {
      whereConditions.push({ contenu: Like(`%#${tag}%`) });
    });

    const order: FindOptionsOrder<Publication> = { 
      date_creation: 'DESC' 
    };

    return whereConditions.length > 0 
      ? this.publicationRepo.find({ 
          where: whereConditions, 
          take: 5,
          order
        })
      : [];
  }
  async searchTags(term: string): Promise<Tag[]> {
    if (!term?.trim() || term.trim().length < 2) return []; // Vérifie aussi les espaces
  
    try {
      const cacheKey = `tags_${term}`;
      const cached = await this.cacheManager.get<Tag[]>(cacheKey);
      if (cached) return cached;
  
      // Requête corrigée pour simple-array :
      const results = await this.tagRepo
        .createQueryBuilder('tag')
        .where('tag.nom LIKE :term', { term: `%${term}%` }) // Recherche dans le nom
        .orWhere('tag.variations LIKE :variationTerm', { 
          variationTerm: `%,${term},%` // Recherche EXACTE dans les variations
        })
        .orderBy('tag.occurrences', 'DESC')
        .limit(10)
        .getMany();
  
      await this.cacheManager.set(cacheKey, results, 30000); // Cache 30s
      return results;
    } catch (error) {
      console.error('Erreur dans searchTags() :', {
        term,
        error: error.message,
        stack: error.stack
      });
      throw new Error('Échec de la recherche de tags');
    }
  }
  private async updateTagPopularity(tags: Tag[]) {
    if (tags.length > 0) {
      await Promise.all(
        tags.map(tag => 
          this.tagService.updateTagUsage(tag.id)
        )
      );
    }
  }

  private async cacheResults(key: string, data: any) {
    await this.cacheManager.set(key, data, data.tags?.length ? 3600000 : 600000);
  }

  private async saveSearchHistory(
    userId: number,
    term: string,
    results: { [key: string]: any[] }
  ) {
    const hasResults = Object.values(results).some((arr: any[]) => arr.length > 0);
    
    await this.searchRepo.save({
      utilisateur: { id: userId },
      terme: term,
      statut: hasResults ? 'trouvé' : 'non trouvé',
      date_recherche: new Date()
    });
  }

  // Méthodes existantes inchangées
  async suggestTags(query: string): Promise<Tag[]> {
    return this.searchTags(query);
  }

  async getDernieresRecherches(utilisateurId: number) {
    return this.searchRepo.find({
      where: { utilisateur: { id: utilisateurId } },
      order: { date_recherche: 'DESC' },
      take: 5,
    });
  }

  async getHistoriqueComplet(utilisateurId: number) {
    return this.searchRepo.find({
      where: { utilisateur: { id: utilisateurId } },
      order: { date_recherche: 'DESC' },
    });
  }

  async clearHistorique(utilisateurId: number) {
    return this.searchRepo.delete({ utilisateur: { id: utilisateurId } });
  }

  async deleteSearchItem(utilisateurId: number, id: number) {
    return this.searchRepo.delete({ id, utilisateur: { id: utilisateurId } });
  }
}