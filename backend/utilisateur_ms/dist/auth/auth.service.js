"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const microservices_1 = require("@nestjs/microservices");
const common_2 = require("@nestjs/common");
let AuthService = class AuthService {
    constructor(prisma, jwtService, userEventsClient) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.userEventsClient = userEventsClient;
    }
    async verifyToken(token) {
        console.log('[USER_SERVICE] ➡️ Inside verifyToken method');
        try {
            const decoded = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET
            });
            console.log('[USER_SERVICE] ✅ Token verified', decoded);
            return { isValid: true, user: decoded };
        }
        catch (error) {
            console.log('[USER_SERVICE] ❌ Token verification failed:', error.message);
            return { isValid: false, error: error.message };
        }
    }
    async register(data) {
        const existingUser = await this.prisma.utilisateur.findUnique({ where: { email: data.email } });
        if (existingUser)
            throw new common_1.UnauthorizedException('Email already exists');
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.utilisateur.create({
            data: { ...data, password: hashedPassword },
        });
        const token = this.generateToken(user);
        this.userEventsClient.emit('user_created', {
            id: user.id,
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
            role: user.role,
        });
        return { user, token };
    }
    async login(email, password) {
        const user = await this.prisma.utilisateur.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return { user, token: this.generateToken(user) };
    }
    generateToken(user) {
        return this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role,
            nomComplet: `${user.nom} ${user.prenom}`,
            nom: user.nom,
            prenom: user.prenom
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_2.Inject)('PUBLICATION_EVENTS_SERVICE')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        microservices_1.ClientProxy])
], AuthService);
//# sourceMappingURL=auth.service.js.map