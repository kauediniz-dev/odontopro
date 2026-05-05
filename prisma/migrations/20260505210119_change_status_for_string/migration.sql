/*
  Warnings:

  - The `status` column on the `Service` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ATIVO', 'INATIVO');

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ATIVO';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ATIVO';
