# Use the Node.js base image
FROM node:23-slim

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
EXPOSE 3001

# Lancer en mode développement
CMD ["pnpm", "run", "start:dev"]