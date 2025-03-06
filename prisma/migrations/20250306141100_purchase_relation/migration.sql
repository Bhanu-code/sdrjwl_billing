-- CreateTable
CREATE TABLE `Purchase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_name` VARCHAR(191) NOT NULL,
    `customer_contact` VARCHAR(191) NULL,
    `customer_address` VARCHAR(191) NULL,
    `purity` INTEGER NOT NULL,
    `description` VARCHAR(191) NULL,
    `pieces` INTEGER NULL,
    `net_weight` INTEGER NULL,
    `gross_weight` INTEGER NULL,
    `gold_rate` INTEGER NULL,
    `total_amount` INTEGER NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
