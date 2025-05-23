import { HttpException, HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { Audience } from '@prisma/client';
import { PublicationGateway } from './publication.gateway';
// import { UserCacheService } from '../users/user-cache.service';

@Injectable()
export class PublicationService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => PublicationGateway))
    private readonly publicationGateway: PublicationGateway,
    // private readonly userCacheService: UserCacheService,
  ) {}

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
  async reportPublication(publicationId: number, userId: number) {
    return this.prisma.publicationArchivesByAdmin.create({
      data: {
        id_user: userId,
        id_publication: publicationId,
        status: false, // pas encore traité
      },
    });
  }
  
  async archiveReportedPost(publicationId: number) {
    // mettre à jour l'enregistrement existant au lieu de le créer
    await this.prisma.publicationArchivesByAdmin.updateMany({
      where: {
        id_publication: publicationId,
        status: false,
      },
      data: {
        status: true,
      },
    });
  
    // puis supprimer la publication de la table principale
    await this.prisma.publications.delete({
      where: { id_publication: publicationId },
    });
  
    return { message: 'Publication archived and deleted successfully.' };
  }
  
  async getReportedPosts() {
    return this.prisma.publicationArchivesByAdmin.findMany({
      where: {
        status: false,
      },
      include: {
        publication: true, // permet d’avoir le contenu à vérifier
      },
    });
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
  async getClubs() {
    try {
      return await this.prisma.clubs.findMany({
        select: { nom: true }
      });
    } catch (error) {
      console.error('Error fetching clubs:', error);
      throw new Error('Failed to fetch clubs.');
    }
  }
 /**
 * Get all publications for a specific user
 * @param userId - The ID of the user whose publications to retrieve
 * @returns Array of publications belonging to the user
 */
async getUserPublications(userId: number) {
  try {
    if (!userId) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }
    
    const userPublications = await this.prisma.publications.findMany({
      where: {
        id_user: userId
      },
      include: {
        // Include related data if needed
        ville: true,
        entreprise: true,
        typeEmploi: true,
        technologie: true
      },
      orderBy: {
        date_publication: 'desc' // Sort by newest first
      }
    });
    
    console.log(`Retrieved ${userPublications.length} publications for user ID: ${userId}`);
    return userPublications;
  } catch (error) {
    console.error('Error fetching user publications:', error);
    throw new HttpException(
      error.message || 'Failed to fetch user publications', 
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
/**
 * Delete a publication belonging to a user
 * @param publicationId - The ID of the publication to delete
 * @param userId - The ID of the user who owns the publication
 * @returns The deleted publication object
 */
async deletePublication(publicationId: number, userId: number) {
  try {
    // First check if the publication exists and belongs to the user
    const publication = await this.prisma.publications.findUnique({
      where: { id_publication: publicationId }
    });

    if (!publication) {
      throw new HttpException('Publication not found', HttpStatus.NOT_FOUND);
    }

    if (publication.id_user !== userId) {
      throw new HttpException('Not authorized to delete this publication', HttpStatus.FORBIDDEN);
    }

    // Use a transaction to ensure data consistency
    return await this.prisma.$transaction(async (prisma) => {
      // First delete all saved entries for this publication
      const deletedSaves = await prisma.publicationSaves.deleteMany({
        where: { id_publication: publicationId }
      });
      
      console.log(`Deleted ${deletedSaves.count} saved entries for publication ${publicationId}`);
      
      // Then delete the publication itself
      const deletedPublication = await prisma.publications.delete({
        where: { id_publication: publicationId }
      });

      // Optionally notify connected clients about the deletion
      this.publicationGateway.server.emit('deletedPublication', { id_publication: publicationId });

      console.log(`Publication ${publicationId} deleted by user ${userId}`);
      return deletedPublication;
    });

  } catch (error) {
    console.error('Error deleting publication:', error);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(
      'Failed to delete publication', 
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

}
