# Étape 1 : build
FROM node:23-slim AS builder

# Installer pnpm
RUN npm install -g pnpm

# Créer dossier de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copier tout le code de l’app
COPY . .

# Générer le client Prisma
RUN pnpm prisma generate

# Exposer le port du microservice
EXPOSE 3003

# Lancer en mode développement
CMD ["pnpm", "run", "start:dev"]