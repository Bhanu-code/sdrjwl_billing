// utils/generateUniqueId.ts
import { prisma } from "~/data/database.server";

// Generate a 6-digit unique product ID
export async function generateUniqueProductId(): Promise<string> {
  let isUnique = false;
  let productId: string;

  while (!isUnique) {
    // Generate a 6-digit random number
    productId = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if the product ID already exists in the database
    const existingProduct = await prisma.product.findFirst({
      where: { product_id: productId },
    });

    // If the product ID doesn't exist, it's unique
    if (!existingProduct) {
      isUnique = true;
    }
  }

  return productId!;
}

// Generate a 13-digit unique barcode number
export async function generateUniqueBarcodeNumber(): Promise<string> {
  let isUnique = false;
  let barcodeNumber: string;

  while (!isUnique) {
    // Generate a 13-digit random number
    barcodeNumber = Math.floor(1000000000000 + Math.random() * 9000000000000).toString();

    // Check if the barcode number already exists in the database
    const existingProduct = await prisma.product.findFirst({
      where: { barcode_number: barcodeNumber },
    });

    // If the barcode number doesn't exist, it's unique
    if (!existingProduct) {
      isUnique = true;
    }
  }

  return barcodeNumber!;
}