import { PrismaService } from '../prisma/prisma.service';
export declare class PublicationSavesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    savePublication(id_publication: number, id_user: number): Promise<{
        id_publication: number;
        id_user: number;
        id_save: number;
    }>;
    removeSavedPublication(id_publication: number, id_user: number): Promise<{
        id_publication: number;
        id_user: number;
        id_save: number;
    }>;
    getUserSavedPublications(id_user: number, options?: {
        skip?: number;
        take?: number;
        includePublicationDetails?: boolean;
        sortBy?: 'recent' | 'oldest' | 'relevant';
    }): Promise<{
        data: ({
            publication: {
                ville: {
                    id_ville: number;
                    nom: string;
                };
                technologie: {
                    id_technologie: number;
                    nom: string;
                };
                entreprise: {
                    id_entreprise: number;
                    nom: string;
                };
                typeEmploi: {
                    id_type_emploi: number;
                    type: string;
                };
            } & {
                description: string;
                tags: string | null;
                image: string | null;
                video: string | null;
                audience: import("@prisma/client").$Enums.Audience;
                id_publication: number;
                id_user: number;
                id_group: number | null;
                date_publication: Date;
                id_ville: number | null;
                id_entreprise: number | null;
                id_type_emploi: number | null;
                id_technologie: number | null;
            };
        } & {
            id_publication: number;
            id_user: number;
            id_save: number;
        })[];
        pagination: {
            total: number;
            skip: number;
            take: number;
            hasMore: boolean;
        };
    }>;
}
