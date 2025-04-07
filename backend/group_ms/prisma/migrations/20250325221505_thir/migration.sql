-- DropForeignKey
ALTER TABLE `members` DROP FOREIGN KEY `members_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `members` DROP FOREIGN KEY `members_userId_fkey`;

-- DropIndex
DROP INDEX `members_groupId_fkey` ON `members`;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
