"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const prisma_module_1 = require("../prisma/prisma.module");
const passport_1 = require("@nestjs/passport");
const jwt_strategy_1 = require("./JWT/jwt.strategy");
const microservices_1 = require("@nestjs/microservices");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: 'PUBLICATION_EVENTS_SERVICE',
                    transport: microservices_1.Transport.RMQ,
                    options: {
                        urls: ['amqp://user:password@localhost:5672'],
                        queue: 'user_events_queue',
                        queueOptions: {
                            durable: true,
                        },
                    },
                },
            ]),
            passport_1.PassportModule,
            prisma_module_1.PrismaModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'default_secret',
                signOptions: { expiresIn: '24h' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map