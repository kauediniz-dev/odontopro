/*
  Warnings:

  - A unique constraint covering the columns `[userId,appointmentDate,time]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "appointments_userId_appointmentDate_time_key" ON "appointments"("userId", "appointmentDate", "time");
