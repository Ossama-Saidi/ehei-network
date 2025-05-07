-- AlterTable
ALTER TABLE `message` ADD COLUMN `isHiddenByReceiver` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isHiddenBySender` BOOLEAN NOT NULL DEFAULT false;
