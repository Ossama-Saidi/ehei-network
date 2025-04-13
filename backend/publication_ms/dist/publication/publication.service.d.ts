import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { Audience } from '@prisma/client';
import { PublicationGateway } from './publication.gateway';
export declare class PublicationService {
    private readonly prisma;
    private readonly publicationGateway;
    constructor(prisma: PrismaService, publicationGateway: PublicationGateway);
    createPublication(data: CreatePublicationDto, userId: number): Promise<{
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
    updatePublicationAudience(id_publication: number, id_user: number, newAudience: Audience): Promise<{
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
}
