/*
  Warnings:

  - Added the required column `gross_weight` to the `SalesPOS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SalesPOS` ADD COLUMN `gross_weight` FLOAT NOT NULL DEFAULT 0;
