-- CreateTable
CREATE TABLE `Utilisateur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `badge` BOOLEAN NOT NULL DEFAULT false,
    `role` ENUM('ETUDIANT', 'PROFESSEUR', 'ADMINISTRATEUR') NOT NULL,
    `status` ENUM('enabled', 'disabled') NOT NULL DEFAULT 'enabled',
    `bio` VARCHAR(191) NULL,
    `profilePhoto` VARCHAR(191) NULL,
    `bannerPhoto` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Utilisateur_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Etudiant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `utilisateurId` INTEGER NOT NULL,
    `filiere` VARCHAR(191) NOT NULL,
    `groupe` VARCHAR(191) NOT NULL,
    `interets` VARCHAR(191) NOT NULL,
    `carteEtudiantId` VARCHAR(191) NOT NULL,
    `carteEtudiantQr` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Etudiant_utilisateurId_key`(`utilisateurId`),
    UNIQUE INDEX `Etudiant_carteEtudiantId_key`(`carteEtudiantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Professeur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `utilisateurId` INTEGER NOT NULL,
    `permissionsTags` VARCHAR(191) NOT NULL,
    `interets` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Professeur_utilisateurId_key`(`utilisateurId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Administrateur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `permissions` VARCHAR(191) NOT NULL,
    `role` ENUM('ETUDIANT', 'PROFESSEUR', 'ADMINISTRATEUR') NOT NULL DEFAULT 'ADMINISTRATEUR',

    UNIQUE INDEX `Administrateur_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Friendship` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `senderId` INTEGER NOT NULL,
    `receiverId` INTEGER NOT NULL,
    `status` ENUM('pending', 'accepted', 'blocked', 'rejected') NOT NULL,

    UNIQUE INDEX `Friendship_senderId_receiverId_key`(`senderId`, `receiverId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Etudiant` ADD CONSTRAINT `Etudiant_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Professeur` ADD CONSTRAINT `Professeur_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friendship` ADD CONSTRAINT `Friendship_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friendship` ADD CONSTRAINT `Friendship_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
