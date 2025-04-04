import { prisma } from "~/data/database.server";
import { generateUniqueProductId, generateUniqueBarcodeNumber } from "~/utils/generateUniqueId";

export async function createProduct(userData: any) {
  // Check if the product already exists
  const existingProduct = await prisma.product.findFirst({
    where: { product_name: userData.product_name },
  });

  if (existingProduct) {
    return { status: 401, msg: "Product Already Present" };
  }

  // Generate a unique 6-digit product ID
  const productId = await generateUniqueProductId();

  // Generate a unique 13-digit barcode number
  const barcodeNumber = await generateUniqueBarcodeNumber();

  // Create the product with the generated product ID and barcode number
  const isSaved = await prisma.product.create({
    data: {
      product_id: productId, // Add the generated product ID
      barcode_number: barcodeNumber, // Add the generated barcode number
      product_name: userData.product_name,
      gross_weight: Number(userData.gross_weight),
      net_weight: Number(userData.net_weight),
      huid_no: userData.huid_no,
      hsn_code: userData.hsn_code,
      sales_rate: Number(userData.sales_rate),
      making_charges: Number(userData.making_charges),
      hallmark_no: userData.hallmark_no,
      other_charges: Number(userData.other_charges),
      unit: userData.unit,
      purity: userData.purity || null,
    },
  });

  if (isSaved) {
    return { status: 201, msg: "Product Created" };
  } else {
    return { status: 401, msg: "Failed to Create Product" };
  }
}

export async function updateProduct(userData: any, id: any) {
  const product = await prisma.product.findFirst({
    where: {
      id: id,
    },
  });

  if (!product) {
    return { status: 401, msg: "Product Not Found!" };
  }

  const isSaved = await prisma.product.update({
    where: {
      id: id,
    },
    data: {
      product_name: userData.product_name,
      gross_weight: Number(userData.gross_weight),
      net_weight: Number(userData.net_weight),
      huid_no: userData.huid_no,
      hsn_code: userData.hsn_code,
      sales_rate: Number(userData.sales_rate),
      making_charges: Number(userData.making_charges),
      hallmark_no: userData.hallmark_no,
      other_charges: Number(userData.other_charges),
      unit: userData.unit,
      purity: userData.purity || null,
    },
  });

  if (isSaved) {
    return { status: 201, msg: "Product Detials Saved" };
  } else {
    return { status: 401, msg: "Failed to Save Details" };
  }
}

export async function getAllProducts() {
  const allProducts = await prisma.product.findMany();

  return allProducts;
}
export async function getProdcutById(id: any) {
  const productInfo = await prisma.product.findFirst({
    where: {
      id: id,
    },
  });

  return productInfo;
}
export async function deleteProductById(id: any) {
  const productInfo = await prisma.product.delete({
    where: {
      id: id,
    },
  });

  return productInfo;
}
