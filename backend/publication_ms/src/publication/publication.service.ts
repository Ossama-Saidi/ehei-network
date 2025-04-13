import { HttpException, HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { Audience } from '@prisma/client';
import { PublicationGateway } from './publication.gateway';
import { UserCacheService } from '../users/user-cache.service';

@Injectable()
export class PublicationService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => PublicationGateway))
    private readonly publicationGateway: PublicationGateway,
    // private readonly userCacheService: UserCacheService,
  ) {}

  // async findAll() {
  //   const publications = await this.prisma.publications.findMany({
  //     include: {
  //       ville: true,
  //       entreprise: true,
  //       typeEmploi: true,
  //       technologie: true,
  //     }
  //   });
    
  //   // Enrich with user data from cache
  //   return publications.map(publication => {
  //     const user = this.userCacheService.getUserById(publication.id_user);
  //     return {
  //       ...publication,
  //       user: user ? {
  //         id: user.id,
  //         nomComplet: user.nomComplet,
  //         role: user.role
  //       } : null
  //     };
  //   });
  // }
  // async findOne(id: number) {
  //   const publication = await this.prisma.publications.findUnique({
  //     where: { id_publication: id },
  //     include: {
  //       ville: true,
  //       entreprise: true,
  //       typeEmploi: true,
  //       technologie: true,
  //       reactions: true,
  //       comments: true,
  //     }
  //   });

  //   if (!publication) {
  //     return null;
  //   }

  //   // Get user data from cache
  //   const user = this.userCacheService.getUserById(publication.id_user);
    
  //   return {
  //     ...publication,
  //     user: user ? {
  //       id: user.id,
  //       nomComplet: user.nomComplet,
  //       role: user.role
  //     } : null
  //   };
  // }

  async createPublication(data: CreatePublicationDto, userId: number) {
    try {
      const ville = data.ville ? await this.prisma.ville.findFirst({
        where: { nom: data.ville },
      }) : null;

      const entreprise = data.entreprise ? await this.prisma.entreprise.findFirst({
        where: { nom: data.entreprise },
      }) : null;

      const typeEmploi = data.typeEmploi ? await this.prisma.typeEmploi.findFirst({
        where: { type: data.typeEmploi },
      }) : null;

      const technologie = data.technologie ? await this.prisma.technologie.findFirst({
        where: { nom: data.technologie },
      }) : null;
      // console.log('Creating publication with DTO:', data);
      const publication = await this.prisma.publications.create({
        data: {
          id_user: userId,
          description: data.description,
          date_publication: new Date(),
          image: data.image,
          video: data.video,
          audience: data.audience || Audience.Public,
          tags: data.tags?.join(','),
          id_ville: ville?.id_ville,
          id_entreprise: entreprise?.id_entreprise,
          id_type_emploi: typeEmploi?.id_type_emploi,
          id_technologie: technologie?.id_technologie,
        },
      });

      this.publicationGateway.server.emit('newPublication', publication);

      return publication;
      
    } catch (error) {
      console.error('Error creating publication:', error);
      throw new HttpException('Failed to create publication.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async updatePublicationAudience(
    id_publication: number, 
    id_user: number,
    newAudience: Audience
  ){
    try {
      // Vérifier que la publication existe et appartient à l'utilisateur
      const existingPublication = await this.prisma.publications.findUnique({
        where: { 
          id_publication: id_publication,
         }
      });
      
      if (!existingPublication) {
        throw new Error('Publication not found');
      }
  
      // Vérifier que l'utilisateur est le propriétaire
      if (existingPublication.id_user !== id_user) {
        throw new Error('User not authorized to modify this publication');
      }

      // Mettre à jour l'audience
      return this.prisma.publications.update({
        where: { id_publication: id_publication },
        data: {
          audience: newAudience 
        }
      });
    } catch (error) {
      console.error('Error updating publication:', error);
      throw new Error(error.message || 'Failed to update publication.');
    }
  }
  async consulterPublications() {
    try {
      const publications = await this.prisma.publications.findMany();
      console.log("Publications récupérées:", publications);
      return publications;
    } catch (error) {
      console.error('Error fetching publications:', error);
      throw new Error('Failed to fetch publications.');
    }
  }
  async consulterPublication(id_publication: string) {
    try {
      const publication = await this.prisma.publications.findUnique({
        where: { id_publication: Number(id_publication) },
      });
      console.log('Publication fetched:', publication);
      return publication;
    } catch (error) {
      console.error('Error fetching publication:', error);
      throw new Error('Failed to fetch publication.');
    }
  }
  async searchPublicationsByTag(tag: string) {
    try {
      if (!tag || typeof tag !== 'string') {
        throw new HttpException('Tag parameter is required', HttpStatus.BAD_REQUEST);
      }
      const publicationsByTag = await this.prisma.publications.findMany({
        where: {
          // Recherche des publications où le tag est inclus dans la chaîne de tags
          // Utilisation de LIKE/CONTAINS pour trouver la correspondance partielle
          OR: [
            { tags: { contains: tag } },
            { tags: { contains: `,${tag}` } },
            { tags: { contains: `${tag},` } },
            { tags: { contains: `,${tag},` } }
          ]
        },
        include: {
          // Relations à inclure si nécessaire
          ville: true,
          entreprise: true,
          typeEmploi: true,
          technologie: true
        },
        orderBy: {
          date_publication: 'desc' // Tri par date décroissante
        }
      });
      console.log("Publications récupérées:", publicationsByTag);
      return publicationsByTag;
    } catch (error) {
      console.error('Error fetching:', error);
      throw error;
    }
  }
  async getCities() {
    try {
      return await this.prisma.ville.findMany({
        select: { nom: true }
      });
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw new Error('Failed to fetch cities.');
    }
  }
  async getEmojis() {
    try {
      return await this.prisma.emoji.findMany({
        select: { unicode: true, category: true }
      });
    } catch (error) {
      console.error('Error fetching emojis:', error);
      throw new Error('Failed to fetch emojis.');
    }
  }
  async getCompanies() {
    try {
      return await this.prisma.entreprise.findMany({
        select: { nom: true }
      });
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw new Error('Failed to fetch companies.');
    }
  }
  async getEmplois() {
    try {
      return await this.prisma.typeEmploi.findMany({
        select: { type: true }
      });
    } catch (error) {
      console.error('Error fetching emplois:', error);
      throw new Error('Failed to fetch emplois.');
    }
  }
  async getTechnologies() {
    try {
      return await this.prisma.technologie.findMany({
        select: { nom: true }
      });
    } catch (error) {
      console.error('Error fetching technologies:', error);
      throw new Error('Failed to fetch technologies.');
    }
  }
  // findAll() {
  //   return `This action returns all publication`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} publication`;
  // }

  // update(id: number, updatePublicationDto: UpdatePublicationDto) {
  //   return `This action updates a #${id} publication`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} publication`;
  // }
}
