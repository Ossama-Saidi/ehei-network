"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicationModule = void 0;
const common_1 = require("@nestjs/common");
const publication_service_1 = require("./publication.service");
const publication_controller_1 = require("./publication.controller");
const prisma_service_1 = require("../prisma/prisma.service");
const prisma_module_1 = require("../prisma/prisma.module");
const publication_gateway_1 = require("./publication.gateway");
let PublicationModule = class PublicationModule {
};
exports.PublicationModule = PublicationModule;
exports.PublicationModule = PublicationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
        ],
        controllers: [publication_controller_1.PublicationController],
        providers: [
            publication_service_1.PublicationService,
            publication_gateway_1.PublicationGateway,
            prisma_service_1.PrismaService,
        ],
        exports: [publication_service_1.PublicationService, publication_gateway_1.PublicationGateway],
    })
], PublicationModule);
//# sourceMappingURL=publication.module.js.map