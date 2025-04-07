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
exports.PublicationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const publication_service_1 = require("./publication.service");
const create_publication_dto_1 = require("./dto/create-publication.dto");
let PublicationGateway = class PublicationGateway {
    constructor(publicationService) {
        this.publicationService = publicationService;
    }
    async handleCreatePublication(createPublicationDto, client) {
        try {
            const publication = await this.publicationService.createPublication(createPublicationDto);
            client.broadcast.emit('newPublication', publication);
        }
        catch (error) {
            console.error('Error in handleCreatePublication:', error);
            client.emit('publicationError', { message: 'Failed to create publication.' });
        }
    }
};
exports.PublicationGateway = PublicationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], PublicationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('createPublication'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_publication_dto_1.CreatePublicationDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], PublicationGateway.prototype, "handleCreatePublication", null);
exports.PublicationGateway = PublicationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => publication_service_1.PublicationService))),
    __metadata("design:paramtypes", [publication_service_1.PublicationService])
], PublicationGateway);
//# sourceMappingURL=publication.gateway.js.map