-- CreateTable
CREATE TABLE `Publications` (
    `id_publication` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `date_publication` DATETIME(3) NOT NULL,
    `image` VARCHAR(191) NULL,
    `video` VARCHAR(191) NULL,
    `audience` ENUM('Public', 'Friends', 'Only_me') NOT NULL,

    PRIMARY KEY (`id_publication`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PublicationSaves` (
    `id_save` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `id_publication` INTEGER NOT NULL,

    INDEX `PublicationSaves_id_user_idx`(`id_user`),
    INDEX `PublicationSaves_id_publication_idx`(`id_publication`),
    PRIMARY KEY (`id_save`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PublicationArchivesByAdmin` (
    `id_archive` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `id_publication` INTEGER NOT NULL,

    INDEX `PublicationArchivesByAdmin_id_user_idx`(`id_user`),
    INDEX `PublicationArchivesByAdmin_id_publication_idx`(`id_publication`),
    PRIMARY KEY (`id_archive`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Shares` (
    `id_share` INTEGER NOT NULL AUTO_INCREMENT,
    `id_publication` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,

    INDEX `Shares_id_user_idx`(`id_user`),
    INDEX `Shares_id_publication_idx`(`id_publication`),
    PRIMARY KEY (`id_share`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reactions` (
    `id_reaction` INTEGER NOT NULL AUTO_INCREMENT,
    `id_publication` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `reaction` ENUM('Like', 'Love', 'Haha') NOT NULL,

    INDEX `Reactions_id_user_idx`(`id_user`),
    INDEX `Reactions_id_publication_idx`(`id_publication`),
    PRIMARY KEY (`id_reaction`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comments` (
    `id_comment` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `id_publication` INTEGER NOT NULL,
    `contenu` TEXT NOT NULL,
    `date_comment` DATETIME(3) NOT NULL,

    INDEX `Comments_id_user_idx`(`id_user`),
    INDEX `Comments_id_publication_idx`(`id_publication`),
    PRIMARY KEY (`id_comment`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PublicationHides` (
    `id_hide` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `id_publication` INTEGER NOT NULL,

    INDEX `PublicationHides_id_user_idx`(`id_user`),
    INDEX `PublicationHides_id_publication_idx`(`id_publication`),
    PRIMARY KEY (`id_hide`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PublicationSaves` ADD CONSTRAINT `PublicationSaves_id_publication_fkey` FOREIGN KEY (`id_publication`) REFERENCES `Publications`(`id_publication`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PublicationArchivesByAdmin` ADD CONSTRAINT `PublicationArchivesByAdmin_id_publication_fkey` FOREIGN KEY (`id_publication`) REFERENCES `Publications`(`id_publication`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shares` ADD CONSTRAINT `Shares_id_publication_fkey` FOREIGN KEY (`id_publication`) REFERENCES `Publications`(`id_publication`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reactions` ADD CONSTRAINT `Reactions_id_publication_fkey` FOREIGN KEY (`id_publication`) REFERENCES `Publications`(`id_publication`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_id_publication_fkey` FOREIGN KEY (`id_publication`) REFERENCES `Publications`(`id_publication`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PublicationHides` ADD CONSTRAINT `PublicationHides_id_publication_fkey` FOREIGN KEY (`id_publication`) REFERENCES `Publications`(`id_publication`) ON DELETE CASCADE ON UPDATE CASCADE;
