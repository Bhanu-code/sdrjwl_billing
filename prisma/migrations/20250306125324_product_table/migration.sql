-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(191) NOT NULL,
    `gross_weight` INTEGER NULL,
    `net_weight` INTEGER NULL,
    `huid_no` INTEGER NULL,
    `hsn_code` VARCHAR(191) NULL,
    `sales_rate` INTEGER NULL,
    `making_charges` INTEGER NULL,
    `hallmark_no` INTEGER NULL,
    `other_charges` INTEGER NULL,
    `unit` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
