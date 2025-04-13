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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let AuthGuard = class AuthGuard {
    constructor(userServiceClient) {
        this.userServiceClient = userServiceClient;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException('Token non fourni');
        }
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.userServiceClient.send({ cmd: 'verify_jwt' }, token).pipe((0, operators_1.timeout)(15000), (0, operators_1.catchError)((err) => {
                console.error('[PUBLICATION_SERVICE] ❌ Erreur communication microservice USER:', err);
                throw new common_1.UnauthorizedException('Le microservice ne répond pas');
            })));
            if (!response.isValid) {
                throw new common_1.UnauthorizedException('Token invalide');
            }
            request.user = response.user;
            console.log('[PUBLICATION_SERVICE] ✅ Token validé, utilisateur :', response.user);
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException(error.message || 'Erreur d\'authentification');
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('USER_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map