# Makefile pour EHEI-NETWORK
# Commandes pour l'installation, la configuration et le démarrage des services

# Couleurs pour une meilleure lisibilité
BLUE=\033[0;34m
GREEN=\033[0;32m
YELLOW=\033[0;33m
RED=\033[0;31m
NC=\033[0m # No Color

# Chemins des services (corrigés selon la structure réelle)
BACKEND_DIR=./backend
FRONTEND_DIR=./frontend
MS_DIRS=$(BACKEND_DIR)/utilisateur_ms $(BACKEND_DIR)/publication_ms $(BACKEND_DIR)/messagerie_ms $(BACKEND_DIR)/notification_ms $(BACKEND_DIR)/recherche_ms

.PHONY: help install-all setup-all start-backend start-frontend start-all stop-all dev clean

# Commande par défaut: afficher l'aide
help:
	@echo "${BLUE}=== EHEI-NETWORK - Commandes disponibles ===${NC}"
	@echo "${GREEN}make install-all${NC}      : Installer les dépendances pour tous les services"
	@echo "${GREEN}make setup-all${NC}        : Configurer Prisma pour tous les microservices"
	@echo "${GREEN}make start-backend${NC}    : Démarrer tous les microservices backend"
	@echo "${GREEN}make start-frontend${NC}   : Démarrer le frontend"
	@echo "${GREEN}make start-all${NC}        : Démarrer le backend et le frontend"
	@echo "${GREEN}make stop-all${NC}         : Arrêter tous les services"
	@echo "${GREEN}make dev${NC}              : Installer, configurer et démarrer tout pour le développement"
	@echo "${GREEN}make clean${NC}            : Nettoyer les node_modules et autres fichiers générés"

# Installation des dépendances
install-all:
	@echo "${BLUE}Installation des dépendances...${NC}"
	@for dir in $(MS_DIRS); do \
		if [ -d "$$dir" ]; then \
			echo "${YELLOW}Installation dans $$dir...${NC}"; \
			(cd "$$dir" && pnpm install); \
		else \
			echo "${RED}Répertoire $$dir introuvable, ignoré${NC}"; \
		fi; \
	done
	@if [ -d "$(FRONTEND_DIR)" ]; then \
		echo "${YELLOW}Installation dans le frontend...${NC}"; \
		(cd "$(FRONTEND_DIR)" && pnpm install); \
	else \
		echo "${RED}Répertoire $(FRONTEND_DIR) introuvable${NC}"; \
	fi
	@echo "${GREEN}Installation des dépendances terminée.${NC}"

# Configuration de Prisma
setup-all:
	@echo "${BLUE}Configuration de Prisma pour tous les microservices...${NC}"
	@for dir in $(MS_DIRS); do \
		if [ -d "$$dir" ]; then \
			echo "${YELLOW}Configuration de Prisma dans $$dir...${NC}"; \
			(cd "$$dir" && pnpm prisma generate && pnpm prisma db push); \
		else \
			echo "${RED}Répertoire $$dir introuvable, ignoré${NC}"; \
		fi; \
	done
	@echo "${GREEN}Configuration de Prisma terminée.${NC}"

# Démarrage du backend
start-backend:
	@echo "${BLUE}Démarrage des microservices backend...${NC}"
	@for dir in $(MS_DIRS); do \
		if [ -d "$$dir" ]; then \
			echo "${YELLOW}Démarrage de $$dir...${NC}"; \
			(cd "$$dir" && pnpm run start:dev &); \
		else \
			echo "${RED}Répertoire $$dir introuvable, ignoré${NC}"; \
		fi; \
	done
	@echo "${GREEN}Tous les microservices backend sont en cours d'exécution.${NC}"

# Démarrage du frontend
start-frontend:
	@echo "${BLUE}Démarrage du frontend...${NC}"
	@if [ -d "$(FRONTEND_DIR)" ]; then \
		(cd "$(FRONTEND_DIR)" && pnpm run dev &); \
		echo "${GREEN}Frontend démarré avec succès.${NC}"; \
	else \
		echo "${RED}Répertoire $(FRONTEND_DIR) introuvable${NC}"; \
	fi

# Démarrage de tous les services
start-all: start-backend start-frontend
	@echo "${GREEN}Tous les services sont en cours d'exécution.${NC}"

# Arrêt de tous les services
stop-all:
	@echo "${BLUE}Arrêt de tous les services...${NC}"
	@pkill -f "pnpm run start:dev" || true
	@pkill -f "pnpm run dev" || true
	@echo "${GREEN}Tous les services ont été arrêtés.${NC}"

# Installation, configuration et démarrage complet pour le développement
dev: install-all setup-all start-all
	@echo "${GREEN}Environnement de développement démarré avec succès!${NC}"

# Nettoyage
clean:
	@echo "${BLUE}Nettoyage des fichiers générés...${NC}"
	@find . -name "node_modules" -type d -prune -exec rm -rf {} \; 2>/dev/null || true
	@find . -name ".next" -type d -prune -exec rm -rf {} \; 2>/dev/null || true
	@echo "${GREEN}Nettoyage terminé.${NC}"