import { prisma } from "~/data/database.server";

export async function createSalesPOS(salesPOSData: any) {
  return await prisma.salesPOS.create({
    data: salesPOSData,
  });
}

export async function getSalesPOSData() {
  return await prisma.salesPOS.findMany();
}