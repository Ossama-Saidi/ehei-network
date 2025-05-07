/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `groups` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `groups` DROP COLUMN `photoUrl`;

-- AlterTable
ALTER TABLE `members` MODIFY `role` ENUM('ADMIN', 'MODERATOR', 'MEMBER') NOT NULL DEFAULT 'ADMIN';

-- CreateTable
CREATE TABLE `posts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicationId` INTEGER NOT NULL,
    `groupId` INTEGER NOT NULL,
    `authorId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `posts_publicationId_key`(`publicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
