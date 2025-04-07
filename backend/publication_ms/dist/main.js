"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const microservices_1 = require("@nestjs/microservices");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const common_1 = require("@nestjs/common");
const path = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter({
        logger: true,
    }));
    app.setGlobalPrefix('api');
    await app.register(require('@fastify/multipart'), {
        limits: {
            fieldNameSize: 100,
            fieldSize: 5 * 1024 * 1024,
            fields: 10,
            fileSize: 1000000,
            files: 1,
            headerPairs: 2000,
            parts: 1000
        }
    });
    app.useStaticAssets({
        root: path.join(__dirname, '..', 'public'),
        index: false,
        prefix: '/public',
        decorateReply: false
    });
    app.enableCors({
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
        credentials: true,
    });
    const dbUrl = process.env.DATABASE_URL;
    const port = parseInt(process.env.HTTP_PORT);
    const microservicePort = parseInt(process.env.MICROSERVICE_PORT);
    console.log(`Database URL: ${dbUrl}`);
    console.log(`HTTP Port: ${port}`);
    console.log(`Microservice Port: ${microservicePort}`);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.use((req, res, next) => {
        console.log(`[${req.method}] ${req.url}`);
        next();
    });
    app.connectMicroservice({
        transport: microservices_1.Transport.TCP,
        options: {
            host: '0.0.0.0',
            port: microservicePort,
        },
    });
    await app.startAllMicroservices();
    await app.listen(port, '0.0.0.0');
    console.log(`PUB-SERVICE running on ports: HTTP ${port}, Microservice ${microservicePort}`);
}
bootstrap();
//# sourceMappingURL=main.js.map