import { prisma } from "~/data/database.server";

export async function createPurchase(userData: any) {
  

  const isSaved = await prisma.purchase.create({
    data: {
      customer_name: userData.customer_name,
      customer_contact: userData.customer_contact,
      customer_address: userData.customer_address,
      purity: Number(userData.purity),
      description: userData.description,
      pieces: Number(userData.pieces),
      net_weight: Number(userData.net_weight),
      gross_weight: Number(userData.gross_weight),
      gold_rate: Number(userData.gold_rate),
      total_amount: Number(userData.total_amount),
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
      name: userData.name,
      address: userData.address,
      city: userData.city,
      district: userData.district,
      state: userData.state,
      pincode: userData.pincode,
      contact_no: userData.contact_no,
      gstin_no: userData.gstin_no,
      upi_id: userData.upi_id,
      pan_no: userData.pan_no,
    },
  });

  if (isSaved) {
    return { status: 201, msg: "Product Detials Saved" };
  } else {
    return { status: 401, msg: "Failed to Save Details" };
  }
}

export async function getAllPurchase() {
  const allPurchase = await prisma.purchase.findMany();

  return allPurchase;
}
export async function getProdcutById(id: any) {
  const productInfo = await prisma.product.findFirst({
    where: {
      id: id,
    },
  });

  return productInfo;
}
export async function deletePurchaseById(id: any) {
  const purchaseInfo = await prisma.purchase.delete({
    where: {
      id: id,
    },
  });

  return purchaseInfo;
}
