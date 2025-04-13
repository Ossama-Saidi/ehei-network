// publication-service/src/publications/dto/publication.dto.ts
export class PublicationDto {
    id_publication: number;
    id_user: number;
    description: string;
    date_publication: Date;
    image?: string;
    video?: string;
    tags?: string;
    audience: string;
    
    // Relations data
    ville?: any;
    entreprise?: any;
    typeEmploi?: any;
    technologie?: any;
    
    // User data from cache
    user?: {
      id: number;
      nomComplet: string;
      role: string;
    };
  }