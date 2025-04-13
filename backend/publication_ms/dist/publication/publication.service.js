"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const publication_gateway_1 = require("./publication.gateway");
let PublicationService = class PublicationService {
    constructor(prisma, publicationGateway) {
        this.prisma = prisma;
        this.publicationGateway = publicationGateway;
    }
    async createPublication(data, userId) {
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
            const publication = await this.prisma.publications.create({
                data: {
                    id_user: userId,
                    description: data.description,
                    date_publication: new Date(),
                    image: data.image,
                    video: data.video,
                    audience: data.audience || client_1.Audience.Public,
                    tags: data.tags?.join(','),
                    id_ville: ville?.id_ville,
                    id_entreprise: entreprise?.id_entreprise,
                    id_type_emploi: typeEmploi?.id_type_emploi,
                    id_technologie: technologie?.id_technologie,
                },
            });
            this.publicationGateway.server.emit('newPublication', publication);
            return publication;
        }
        catch (error) {
            console.error('Error creating publication:', error);
            throw new common_1.HttpException('Failed to create publication.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updatePublicationAudience(id_publication, id_user, newAudience) {
        try {
            const existingPublication = await this.prisma.publications.findUnique({
                where: {
                    id_publication: id_publication,
                }
            });
            if (!existingPublication) {
                throw new Error('Publication not found');
            }
            if (existingPublication.id_user !== id_user) {
                throw new Error('User not authorized to modify this publication');
            }
            return this.prisma.publications.update({
                where: { id_publication: id_publication },
                data: {
                    audience: newAudience
                }
            });
        }
        catch (error) {
            console.error('Error updating publication:', error);
            throw new Error(error.message || 'Failed to update publication.');
        }
    }
    async consulterPublications() {
        try {
            const publications = await this.prisma.publications.findMany();
            console.log("Publications récupérées:", publications);
            return publications;
        }
        catch (error) {
            console.error('Error fetching publications:', error);
            throw new Error('Failed to fetch publications.');
        }
    }
    async consulterPublication(id_publication) {
        try {
            const publication = await this.prisma.publications.findUnique({
                where: { id_publication: Number(id_publication) },
            });
            console.log('Publication fetched:', publication);
            return publication;
        }
        catch (error) {
            console.error('Error fetching publication:', error);
            throw new Error('Failed to fetch publication.');
        }
    }
    async searchPublicationsByTag(tag) {
        try {
            if (!tag || typeof tag !== 'string') {
                throw new common_1.HttpException('Tag parameter is required', common_1.HttpStatus.BAD_REQUEST);
            }
            const publicationsByTag = await this.prisma.publications.findMany({
                where: {
                    OR: [
                        { tags: { contains: tag } },
                        { tags: { contains: `,${tag}` } },
                        { tags: { contains: `${tag},` } },
                        { tags: { contains: `,${tag},` } }
                    ]
                },
                include: {
                    ville: true,
                    entreprise: true,
                    typeEmploi: true,
                    technologie: true
                },
                orderBy: {
                    date_publication: 'desc'
                }
            });
            console.log("Publications récupérées:", publicationsByTag);
            return publicationsByTag;
        }
        catch (error) {
            console.error('Error fetching:', error);
            throw error;
        }
    }
    async getCities() {
        try {
            return await this.prisma.ville.findMany({
                select: { nom: true }
            });
        }
        catch (error) {
            console.error('Error fetching cities:', error);
            throw new Error('Failed to fetch cities.');
        }
    }
    async getEmojis() {
        try {
            return await this.prisma.emoji.findMany({
                select: { unicode: true, category: true }
            });
        }
        catch (error) {
            console.error('Error fetching emojis:', error);
            throw new Error('Failed to fetch emojis.');
        }
    }
    async getCompanies() {
        try {
            return await this.prisma.entreprise.findMany({
                select: { nom: true }
            });
        }
        catch (error) {
            console.error('Error fetching companies:', error);
            throw new Error('Failed to fetch companies.');
        }
    }
    async getEmplois() {
        try {
            return await this.prisma.typeEmploi.findMany({
                select: { type: true }
            });
        }
        catch (error) {
            console.error('Error fetching emplois:', error);
            throw new Error('Failed to fetch emplois.');
        }
    }
    async getTechnologies() {
        try {
            return await this.prisma.technologie.findMany({
                select: { nom: true }
            });
        }
        catch (error) {
            console.error('Error fetching technologies:', error);
            throw new Error('Failed to fetch technologies.');
        }
    }
};
exports.PublicationService = PublicationService;
exports.PublicationService = PublicationService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => publication_gateway_1.PublicationGateway))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        publication_gateway_1.PublicationGateway])
], PublicationService);
//# sourceMappingURL=publication.service.js.map