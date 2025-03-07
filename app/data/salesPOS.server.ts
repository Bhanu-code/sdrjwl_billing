import { prisma } from "~/data/database.server";
import { z } from "zod";

// Validation Schema
export const SalesPOSSchema = z.object({
  id: z.number().optional(),
  contact_number: z.string(),
  customer_id: z.string(),
  customer_name: z.string(),
  gstin_no: z.string(),
  product_code: z.string(),
  product_name: z.string(),
  gold_price: z.number(),
  live_rate: z.boolean(),
  master_entry_rate: z.number().optional(),
  manual_rate: z.number().optional(),
  unit: z.string(),
  net_weight: z.number(),
  making_charges: z.number(),
  sales_total: z.number(),
  discount_percent: z.number(),
  total_rate: z.number(),
  gst_type: z.string(),
  total_amount: z.number(),
  barcode_number: z.string(),
  other_charges: z.number(),
  reference: z.string(),
  pay_mode: z.string(),
  cash_adjustment: z.number(),
});

// Create Sales POS
export async function createSalesPOS(data: z.infer<typeof SalesPOSSchema>) {
  try {
    const validatedData = SalesPOSSchema.parse(data);
    return await prisma.salesPOS.create({
      data: validatedData,
    });
  } catch (error) {
    console.error('Create Sales POS Error:', error);
    throw error;
  }
}

// Get Sales POS Data
export async function getSalesPOSData() {
  try {
    return await prisma.salesPOS.findMany();
  } catch (error) {
    console.error('Get Sales POS Data Error:', error);
    throw error;
  }
}

// Update Sales POS
export async function updateSalesPOS(id: number, data: z.infer<typeof SalesPOSSchema>) {
  try {
    const validatedData = SalesPOSSchema.parse(data);
    return await prisma.salesPOS.update({
      where: { id },
      data: validatedData,
    });
  } catch (error) {
    console.error('Update Sales POS Error:', error);
    throw error;
  }
}

// Delete Sales POS
export async function deleteSalesPOS(id: number) {
  try {
    return await prisma.salesPOS.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Delete Sales POS Error:', error);
    throw error;
  }
}