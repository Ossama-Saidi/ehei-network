import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicationSavesService {
  constructor(
      private readonly prisma: PrismaService,
    ) {}
  async savePublication(
    id_publication: number,
    id_user: number
  ) {
    try {
      // Check if the publication exists
      const existingPublication = await this.prisma.publications.findUnique({
        where: { 
          id_publication: id_publication,
        }
      });
      
      if (!existingPublication) {
        throw new Error('Publication not found');
      }
  
      // Check if the save already exists to avoid duplicates
      const existingSave = await this.prisma.publicationSaves.findFirst({
        where: {
          id_publication: id_publication,
          id_user: id_user
        }
      });
  
      if (existingSave) {
        throw new Error('Publication already saved by this user');
      }
  
      // Create the save entry
      return this.prisma.publicationSaves.create({
        data: {
          id_publication: id_publication,
          id_user: id_user
        }
      });
    } catch (error) {
      console.error('Error saving publication:', error);
      throw new Error(error.message || 'Failed to save publication.');
    }
  }
  async removeSavedPublication(
    id_publication: number,
    id_user: number
  ) {
    try {
      // Check if the save exists
      const existingSave = await this.prisma.publicationSaves.findFirst({
        where: {
          id_publication: id_publication,
          id_user: id_user
        }
      });
      
      if (!existingSave) {
        throw new Error('Publication not saved by this user');
      }
  
      // Delete the save entry
      return this.prisma.publicationSaves.delete({
        where: {
          id_save: existingSave.id_save
        }
      });
    } catch (error) {
      console.error('Error removing saved publication:', error);
      throw new Error(error.message || 'Failed to remove saved publication.');
    }
  }
  async getUserSavedPublications(
    id_user: number,
    options?: {
      skip?: number;
      take?: number;
      includePublicationDetails?: boolean;
      sortBy?: 'recent' | 'oldest' | 'relevant';
    }
  ) {
    try {
      const { skip = 0, take = 6, includePublicationDetails = true, sortBy = 'recent' } = options || {};
      
      let orderBy: any = {};
      // Définir l'ordre de tri selon l'option choisie
      switch(sortBy) {
        case 'oldest':
          // Tri par date de publication croissante
          orderBy = { 
            publication: { date_publication: 'asc' } 
          };
          break;
        case 'relevant':
          // Pour la pertinence, on pourrait utiliser une combinaison de facteurs
          // Ici c'est un exemple simple basé sur la date, mais vous pourriez
          // adapter selon votre définition de "pertinence"
          orderBy = {
            publication: { 
              // Vous pourriez ajouter d'autres critères ici selon votre logique de pertinence
              // Par exemple, nombre de réactions, commentaires, etc.
              tags: 'asc' // Simple exemple, à adapter selon vos besoins
            }
          };
          break;
        case 'recent':
        default:
          // Par défaut, tri par date de publication décroissante (plus récent)
          orderBy = { 
            publication: { date_publication: 'desc' } 
          };
          break;
      }
      // Query to get saved publications with pagination
      const savedPublications = await this.prisma.publicationSaves.findMany({
        where: {
          id_user: id_user
        },
        skip: skip,
        take: take,
        orderBy: orderBy,
        include: includePublicationDetails ? {
          publication: {
            include: {
              ville: true,
              entreprise: true,
              typeEmploi: true,
              technologie: true
            }
          }
        } : undefined
      });
      
      // Get total count for pagination info
      const totalCount = await this.prisma.publicationSaves.count({
        where: {
          id_user: id_user
        }
      });
      
      return {
        data: savedPublications,
        pagination: {
          total: totalCount,
          skip,
          take,
          hasMore: skip + take < totalCount
        }
      };
    } catch (error) {
      console.error('Error retrieving saved publications:', error);
      throw new Error(error.message || 'Failed to retrieve saved publications.');
    }
  }
  /*
  This method:
    1. Retrieves all publications saved by a specific user with pagination support
    2. Has optional parameters for pagination (skip, take) and for including publication details
    3. Orders results with most recent saves first
    4. Includes related data (ville, entreprise, typeEmploi, technologie) when requested
    5. Returns pagination information along with the data
    6. Implements proper error handling */
}
