# Étape 1 : build
FROM node:23-slim AS builder

WORKDIR /app

# Installer pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copier les fichiers nécessaires
COPY package.json pnpm-lock.yaml ./

# Installer les dépendances
RUN pnpm install

# Copier le reste du code
COPY . .

# Construire l’application Next.js
RUN pnpm build

# Étape 2 : image pour exécution
FROM node:23-slim AS runner

WORKDIR /app

# Installer pnpm dans l’image finale aussi
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copier uniquement les éléments nécessaires
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Port exposé pour Next.js
EXPOSE 3000

# Lancer l'app
CMD ["pnpm", "start"]
