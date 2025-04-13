import { Audience } from '@prisma/client';
export declare class CreatePublicationDto {
    description: string;
    tags?: string[];
    ville?: string;
    entreprise?: string;
    typeEmploi?: string;
    technologie?: string;
    image?: string;
    video?: string;
    audience?: Audience;
}
