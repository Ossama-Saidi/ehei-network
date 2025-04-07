import { PublicationSavesService } from './publication-saves.service';
import { savePublicationDto } from './dto/save-publication.dto';
export declare class PublicationSavesController {
    private readonly publicationSavesService;
    constructor(publicationSavesService: PublicationSavesService);
    savePublication(savePublicationDto: savePublicationDto): Promise<{
        id_user: number;
        id_publication: number;
        id_save: number;
    }>;
    removeSavedPublication(savePublicationDto: savePublicationDto): Promise<{
        id_user: number;
        id_publication: number;
        id_save: number;
    }>;
    getUserSavedPublications(id_user: number, skip?: number, take?: number, includeDetails?: boolean, sortBy?: 'recent' | 'oldest' | 'relevant'): Promise<{
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
                id_user: number;
                description: string;
                tags: string | null;
                image: string | null;
                video: string | null;
                audience: import("@prisma/client").$Enums.Audience;
                id_publication: number;
                id_group: number | null;
                date_publication: Date;
                id_ville: number | null;
                id_entreprise: number | null;
                id_type_emploi: number | null;
                id_technologie: number | null;
            };
        } & {
            id_user: number;
            id_publication: number;
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
