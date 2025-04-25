import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs'; // ✅ Import de fs pour vérifier et créer le dossier
import { NestExpressApplication } from '@nestjs/platform-express'; // ✅ Import nécessaire
import * as express from 'express'; // Import express pour utiliser le middleware statique

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // ✅ Cast ici

  // Créer automatiquement le dossier 'uploads' s'il n'existe pas
  const uploadDir = join(__dirname, '..', 'uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
    console.log('Dossier "uploads" créé automatiquement.');
  } else {
    console.log('Le dossier "uploads" existe déjà.');
  }

  app.enableCors();

  const port = process.env.PORT ?? 3003;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3033,
    },
  });

  // Middleware pour servir les fichiers statiques depuis le dossier 'uploads'
  app.use('/uploads', express.static(uploadDir));

  await app.startAllMicroservices();
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
