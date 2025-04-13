export declare class PublicationDto {
    id_publication: number;
    id_user: number;
    description: string;
    date_publication: Date;
    image?: string;
    video?: string;
    tags?: string;
    audience: string;
    ville?: any;
    entreprise?: any;
    typeEmploi?: any;
    technologie?: any;
    user?: {
        id: number;
        nomComplet: string;
        role: string;
    };
}
