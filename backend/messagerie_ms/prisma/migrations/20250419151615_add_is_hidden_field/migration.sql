/*
  Warnings:

  - You are about to drop the column `isHiddenByReceiver` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `isHiddenBySender` on the `message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `message` DROP COLUMN `isHiddenByReceiver`,
    DROP COLUMN `isHiddenBySender`,
    ADD COLUMN `isHidden` BOOLEAN NOT NULL DEFAULT false;
