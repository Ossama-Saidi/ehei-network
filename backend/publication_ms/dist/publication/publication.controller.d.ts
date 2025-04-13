import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { Audience } from '@prisma/client';
export declare class PublicationController {
    private readonly publicationService;
    constructor(publicationService: PublicationService);
    create(createPublicationDto: CreatePublicationDto, user: any): Promise<{
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
    }>;
    uploadImage(files: {
        file?: MemoryStorageFile[];
    }): Promise<{
        message: string;
        imageUrl: string;
    }>;
    getImage(imageName: string, res: any): Promise<any>;
    debugUploads(): Promise<{
        workingDirectory: string;
        uploadsPath: string;
        directoryExists: boolean;
        files: string[];
        error?: undefined;
        stack?: undefined;
    } | {
        error: any;
        stack: any;
        workingDirectory?: undefined;
        uploadsPath?: undefined;
        directoryExists?: undefined;
        files?: undefined;
    }>;
    consulterPublications(): Promise<{
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
    }[]>;
    consulterPublication(id_publication: string): Promise<{
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
    }>;
    searchPublicationsByTag(tag: string): Promise<({
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
    })[]>;
    getCities(): Promise<{
        nom: string;
    }[]>;
    getEmojis(): Promise<{
        unicode: string;
        category: string;
    }[]>;
    getCompanies(): Promise<{
        nom: string;
    }[]>;
    getEmplois(): Promise<{
        type: string;
    }[]>;
    getTechnologies(): Promise<{
        nom: string;
    }[]>;
    updateAudience(id_publication: string, audienceData: {
        audience: Audience;
        id_user: number;
    }): Promise<{
        statusCode: number;
        message: string;
        data: {
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
    }>;
}
