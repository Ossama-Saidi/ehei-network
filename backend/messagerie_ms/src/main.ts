import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Récupère le port depuis les variables d'environnement ou utilise le port 3000 par défaut
  const port = process.env.PORT ?? 3003;
  // Configurer l'application comme microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3033,
    },
  });

  // Démarre l'application
  await app.listen(port);
    // Démarrer tous les microservices

  await app.startAllMicroservices();

  // Affiche l'URL dans la consol
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
