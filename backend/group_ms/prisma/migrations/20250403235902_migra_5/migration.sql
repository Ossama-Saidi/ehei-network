/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `groups` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `groups_name_key` ON `groups`;

-- CreateIndex
CREATE UNIQUE INDEX `groups_id_key` ON `groups`(`id`);
