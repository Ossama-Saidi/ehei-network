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
exports.PublicationSavesController = void 0;
const common_1 = require("@nestjs/common");
const publication_saves_service_1 = require("./publication-saves.service");
const save_publication_dto_1 = require("./dto/save-publication.dto");
let PublicationSavesController = class PublicationSavesController {
    constructor(publicationSavesService) {
        this.publicationSavesService = publicationSavesService;
    }
    async savePublication(savePublicationDto) {
        try {
            return await this.publicationSavesService.savePublication(savePublicationDto.id_publication, savePublicationDto.id_user);
        }
        catch (error) {
            if (error.message === 'Publication not found' ||
                error.message === 'Publication already saved by this user') {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException('Failed to save publication.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async removeSavedPublication(savePublicationDto) {
        try {
            return await this.publicationSavesService.removeSavedPublication(savePublicationDto.id_publication, savePublicationDto.id_user);
        }
        catch (error) {
            if (error.message === 'Publication not saved by this user') {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException('Failed to remove saved publication.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUserSavedPublications(id_user, skip, take, includeDetails, sortBy) {
        try {
            return await this.publicationSavesService.getUserSavedPublications(+id_user, {
                skip: skip ? +skip : undefined,
                take: take ? +take : undefined,
                includePublicationDetails: includeDetails !== undefined ? includeDetails === true : undefined,
                sortBy: sortBy
            });
        }
        catch (error) {
            throw new common_1.HttpException('Failed to retrieve saved publications.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.PublicationSavesController = PublicationSavesController;
__decorate([
    (0, common_1.Post)('save'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [save_publication_dto_1.savePublicationDto]),
    __metadata("design:returntype", Promise)
], PublicationSavesController.prototype, "savePublication", null);
__decorate([
    (0, common_1.Delete)('save'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [save_publication_dto_1.savePublicationDto]),
    __metadata("design:returntype", Promise)
], PublicationSavesController.prototype, "removeSavedPublication", null);
__decorate([
    (0, common_1.Get)('saves/:id_user'),
    __param(0, (0, common_1.Param)('id_user')),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('take')),
    __param(3, (0, common_1.Query)('includeDetails')),
    __param(4, (0, common_1.Query)('sortBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Boolean, String]),
    __metadata("design:returntype", Promise)
], PublicationSavesController.prototype, "getUserSavedPublications", null);
exports.PublicationSavesController = PublicationSavesController = __decorate([
    (0, common_1.Controller)('publication-saves'),
    __metadata("design:paramtypes", [publication_saves_service_1.PublicationSavesService])
], PublicationSavesController);
//# sourceMappingURL=publication-saves.controller.js.map