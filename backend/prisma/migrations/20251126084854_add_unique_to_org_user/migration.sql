/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `OrganizationUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrganizationUser_userId_key" ON "OrganizationUser"("userId");
