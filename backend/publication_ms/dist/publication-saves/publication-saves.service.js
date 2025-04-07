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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicationSavesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PublicationSavesService = class PublicationSavesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async savePublication(id_publication, id_user) {
        try {
            const existingPublication = await this.prisma.publications.findUnique({
                where: {
                    id_publication: id_publication,
                }
            });
            if (!existingPublication) {
                throw new Error('Publication not found');
            }
            const existingSave = await this.prisma.publicationSaves.findFirst({
                where: {
                    id_publication: id_publication,
                    id_user: id_user
                }
            });
            if (existingSave) {
                throw new Error('Publication already saved by this user');
            }
            return this.prisma.publicationSaves.create({
                data: {
                    id_publication: id_publication,
                    id_user: id_user
                }
            });
        }
        catch (error) {
            console.error('Error saving publication:', error);
            throw new Error(error.message || 'Failed to save publication.');
        }
    }
    async removeSavedPublication(id_publication, id_user) {
        try {
            const existingSave = await this.prisma.publicationSaves.findFirst({
                where: {
                    id_publication: id_publication,
                    id_user: id_user
                }
            });
            if (!existingSave) {
                throw new Error('Publication not saved by this user');
            }
            return this.prisma.publicationSaves.delete({
                where: {
                    id_save: existingSave.id_save
                }
            });
        }
        catch (error) {
            console.error('Error removing saved publication:', error);
            throw new Error(error.message || 'Failed to remove saved publication.');
        }
    }
    async getUserSavedPublications(id_user, options) {
        try {
            const { skip = 0, take = 6, includePublicationDetails = true, sortBy = 'recent' } = options || {};
            let orderBy = {};
            switch (sortBy) {
                case 'oldest':
                    orderBy = {
                        publication: { date_publication: 'asc' }
                    };
                    break;
                case 'relevant':
                    orderBy = {
                        publication: {
                            tags: 'asc'
                        }
                    };
                    break;
                case 'recent':
                default:
                    orderBy = {
                        publication: { date_publication: 'desc' }
                    };
                    break;
            }
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
        }
        catch (error) {
            console.error('Error retrieving saved publications:', error);
            throw new Error(error.message || 'Failed to retrieve saved publications.');
        }
    }
};
exports.PublicationSavesService = PublicationSavesService;
exports.PublicationSavesService = PublicationSavesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicationSavesService);
//# sourceMappingURL=publication-saves.service.js.map