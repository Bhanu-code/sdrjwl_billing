import { prisma } from "~/data/database.server";

export async function createProduct(userData: any) {
  const existingUser = await prisma.product.findFirst({
    where: { product_name: userData.product_name },
  });

  if (existingUser) {
    return { status: 401, msg: "Product Already Present" };
  }

  const isSaved = await prisma.product.create({
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
