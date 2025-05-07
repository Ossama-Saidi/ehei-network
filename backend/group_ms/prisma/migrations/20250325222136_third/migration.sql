/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `blocked_users` DROP FOREIGN KEY `blocked_users_userId_fkey`;

-- DropForeignKey
ALTER TABLE `invitations` DROP FOREIGN KEY `invitations_userId_fkey`;

-- DropForeignKey
ALTER TABLE `members` DROP FOREIGN KEY `members_userId_fkey`;

-- DropForeignKey
ALTER TABLE `membership_requests` DROP FOREIGN KEY `membership_requests_userId_fkey`;

-- DropTable
DROP TABLE `users`;
