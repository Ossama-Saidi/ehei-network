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
exports.PublicationController = void 0;
const common_1 = require("@nestjs/common");
const publication_service_1 = require("./publication.service");
const create_publication_dto_1 = require("./dto/create-publication.dto");
const nest_file_fastify_1 = require("@blazity/nest-file-fastify");
const fs = require("fs");
const path = require("path");
const auth_guard_1 = require("../auth/auth.guard");
const user_decorator_1 = require("../auth/user.decorator");
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
let PublicationController = class PublicationController {
    constructor(publicationService) {
        this.publicationService = publicationService;
    }
    async create(createPublicationDto, user) {
        try {
            console.log(createPublicationDto);
            return await this.publicationService.createPublication(createPublicationDto, user.sub);
        }
        catch (error) {
            throw new common_1.HttpException('Failed to create publication.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            console.log(`Publication créée par l'utilisateur: ${user.email} ${user.sub}`);
        }
    }
    async uploadImage(files) {
        try {
            console.log('Upload method called, files:', files);
            const file = files?.file?.[0];
            if (!file) {
                console.error('No file uploaded');
                throw new common_1.HttpException('No file uploaded', common_1.HttpStatus.BAD_REQUEST);
            }
            if (file.size > MAX_FILE_SIZE) {
                throw new common_1.HttpException('File size exceeds 5MB limit', common_1.HttpStatus.BAD_REQUEST);
            }
            if (!ALLOWED_TYPES.includes(file.mimetype)) {
                throw new common_1.HttpException('Invalid file type', common_1.HttpStatus.BAD_REQUEST);
            }
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }
            const timestamp = Date.now();
            const randomStr = Array(16)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
            const extension = file.mimetype.split('/')[1];
            const filename = `${timestamp}-${randomStr}.${extension}`;
            const filePath = path.join(uploadsDir, filename);
            console.log('File details:', {
                extension,
                filename,
                filePath,
                mimetype: file.mimetype,
                size: file.size
            });
            fs.writeFileSync(filePath, file.buffer);
            return {
                message: 'File uploaded successfully',
                imageUrl: `${filename}`
            };
        }
        catch (error) {
            console.error('Upload error:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Unexpected error during file upload', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getImage(imageName, res) {
        try {
            if (imageName.includes('..') || imageName.includes('/') || imageName.includes('\\')) {
                throw new common_1.HttpException('Invalid file name', common_1.HttpStatus.BAD_REQUEST);
            }
            const filePath = path.join(process.cwd(), 'public', 'uploads', imageName);
            if (!fs.existsSync(filePath)) {
                console.log(`Image not found: ${filePath}`);
                throw new common_1.HttpException('Image not found!', common_1.HttpStatus.NOT_FOUND);
            }
            let contentType = 'application/octet-stream';
            if (imageName.endsWith('.png'))
                contentType = 'image/png';
            if (imageName.endsWith('.jpg') || imageName.endsWith('.jpeg'))
                contentType = 'image/jpeg';
            if (imageName.endsWith('.gif'))
                contentType = 'image/gif';
            const fileBuffer = fs.readFileSync(filePath);
            res.header('Content-Type', contentType);
            return res.send(fileBuffer);
        }
        catch (error) {
            console.error('Error serving image:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Error serving image', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async debugUploads() {
        try {
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
            console.log('Uploads directory path:', uploadsDir);
            const dirExists = fs.existsSync(uploadsDir);
            const files = dirExists ? fs.readdirSync(uploadsDir) : [];
            return {
                workingDirectory: process.cwd(),
                uploadsPath: uploadsDir,
                directoryExists: dirExists,
                files: files
            };
        }
        catch (error) {
            console.error('Debug error:', error);
            return {
                error: error.message,
                stack: error.stack
            };
        }
    }
    async consulterPublications() {
        try {
            return await this.publicationService.consulterPublications();
        }
        catch (error) {
            throw new Error('Failed to fetch publications.');
        }
    }
    async consulterPublication(id_publication) {
        try {
            return await this.publicationService.consulterPublication(id_publication);
        }
        catch (error) {
            console.error('Error fetching publication:', error);
            throw new Error('Failed to fetch publication.');
        }
    }
    async searchPublicationsByTag(tag) {
        try {
            return await this.publicationService.searchPublicationsByTag(tag);
        }
        catch (error) {
            throw new common_1.HttpException('Failed to search publications by tag.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCities() {
        try {
            return await this.publicationService.getCities();
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch cities.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmojis() {
        try {
            return await this.publicationService.getEmojis();
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch emojis.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCompanies() {
        try {
            return await this.publicationService.getCompanies();
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch companies.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmplois() {
        try {
            return await this.publicationService.getEmplois();
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch emplois.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTechnologies() {
        try {
            return await this.publicationService.getTechnologies();
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch technologies.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateAudience(id_publication, audienceData) {
        try {
            const id_user = audienceData.id_user;
            if (!id_user) {
                throw new common_1.HttpException({
                    statusCode: 400,
                    message: 'ID utilisateur manquant',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            console.log('User ID from request:', id_user);
            const updatedPublication = await this.publicationService.updatePublicationAudience(Number(id_publication), Number(id_user), audienceData.audience);
            return {
                statusCode: 200,
                message: 'Audience mise à jour avec succès',
                data: updatedPublication
            };
        }
        catch (error) {
            if (error.message === 'Publication not found') {
                throw new common_1.HttpException({
                    statusCode: 404,
                    message: error.message,
                }, common_1.HttpStatus.NOT_FOUND);
            }
            else if (error.message === 'User not authorized to modify this publication') {
                throw new common_1.HttpException({
                    statusCode: 403,
                    message: error.message,
                }, common_1.HttpStatus.FORBIDDEN);
            }
            else {
                throw new common_1.HttpException({
                    statusCode: 500,
                    message: 'Ops! ,Erreur lors de la mise à jour de l\'audience',
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
};
exports.PublicationController = PublicationController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_publication_dto_1.CreatePublicationDto, Object]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, nest_file_fastify_1.FileFieldsInterceptor)([
        {
            name: 'file',
            maxCount: 1
        }
    ])),
    __param(0, (0, nest_file_fastify_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Get)('image/:imageName'),
    __param(0, (0, common_1.Param)('imageName')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "getImage", null);
__decorate([
    (0, common_1.Get)('debug-uploads'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "debugUploads", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "consulterPublications", null);
__decorate([
    (0, common_1.Get)(':id_publication'),
    __param(0, (0, common_1.Param)('id_publication')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "consulterPublication", null);
__decorate([
    (0, common_1.Get)('searchtags'),
    __param(0, (0, common_1.Query)('tag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "searchPublicationsByTag", null);
__decorate([
    (0, common_1.Get)('cities'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "getCities", null);
__decorate([
    (0, common_1.Get)('emojis'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "getEmojis", null);
__decorate([
    (0, common_1.Get)('companies'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "getCompanies", null);
__decorate([
    (0, common_1.Get)('emplois'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "getEmplois", null);
__decorate([
    (0, common_1.Get)('technologies'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "getTechnologies", null);
__decorate([
    (0, common_1.Patch)(':id/audience'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "updateAudience", null);
exports.PublicationController = PublicationController = __decorate([
    (0, common_1.Controller)('publications'),
    __metadata("design:paramtypes", [publication_service_1.PublicationService])
], PublicationController);
//# sourceMappingURL=publication.controller.js.map