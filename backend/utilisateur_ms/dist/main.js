"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    const port = 3001;
    const frontendUrl = 'http://localhost:3000';
    const groupServiceHost = '127.0.0.1';
    const groupServicePort = 3002;
    app.enableCors({
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    common_1.Logger.log(`User microservice configuration:`);
    common_1.Logger.log(`- Port: ${port}`);
    common_1.Logger.log(`- Frontend URL: ${frontendUrl}`);
    common_1.Logger.log(`- Group Service: http://${groupServiceHost}:${groupServicePort}`);
    await app.listen(port);
    common_1.Logger.log(`User microservice running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map