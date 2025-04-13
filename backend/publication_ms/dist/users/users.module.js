"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const user_cache_service_1 = require("./user-cache.service");
const users_events_controller_1 = require("./users-events.controller");
const users_controller_1 = require("./users.controller");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: 'USER_SERVICE',
                    transport: microservices_1.Transport.RMQ,
                    options: {
                        urls: ['amqp://user:password@localhost:5672'],
                        queue: 'user_events_queue',
                        queueOptions: {
                            durable: true
                        },
                    },
                },
            ]),
        ],
        controllers: [users_events_controller_1.UsersEventsController, users_controller_1.UsersController],
        providers: [user_cache_service_1.UserCacheService],
        exports: [user_cache_service_1.UserCacheService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map