import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async searchTags(term: string): Promise<Tag[]> {
    if (!term) return [];

    console.log('Term reçu:', term);

    const keepHashtag = term.startsWith('#');
    const searchTerm = keepHashtag ? term.slice(1) : term;

    if (searchTerm.length < 2) return [];

    console.log('Recherche effective pour:', searchTerm);

    const results = await this.tagRepo.find({
      where: [
        { nom: Like(`%${searchTerm}%`) },
        { variations: Like(`%,${searchTerm},%`) }
      ],
      order: { occurrences: 'DESC' },
      take: 10
    });

    console.log('Résultats bruts:', results);

    // On transforme en instances de Tag (nécessaire pour garder les méthodes de classe)
    const tagInstances = plainToInstance(Tag, results);

    if (keepHashtag) {
      tagInstances.forEach(tag => {
        (tag as any).displayName = `#${tag.nom}`;
      });
    }

    return tagInstances;
  }

  async updateTagUsage(tagId: number): Promise<void> {
    const tag = await this.tagRepo.findOne({ where: { id: tagId } });
    if (tag) {
      const metadata = tag.getMetadataObject();
      metadata.lastUsedDate = new Date();

      await this.tagRepo.update(tagId, {
        occurrences: () => 'occurrences + 1',
        lastUsedDate: new Date(),
        metadata: JSON.stringify(metadata)
      });
    }
  }
}
