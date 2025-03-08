/*
  Warnings:

  - A unique constraint covering the columns `[product_id]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barcode_number]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `barcode_number` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Product` ADD COLUMN `barcode_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `product_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Product_product_id_key` ON `Product`(`product_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Product_barcode_number_key` ON `Product`(`barcode_number`);
