// app/server/masterEntry.server.ts
import { prisma } from "~/data/database.server";
import { z } from "zod";

// Validation Schema
export const MasterEntrySchema = z.object({
  id: z.number().optional(),
  gold_16k: z.number().min(0).optional(),
  gold_18k: z.number().min(0).optional(),
  gold_22k: z.number().min(0).optional(),
  gold_24k: z.number().min(0).optional(),
  silver_pure: z.number().min(0).optional(),
  silver_ornamental: z.number().min(0).optional(),
  remarks: z.string().optional().nullable(),
  created_at: z.date().optional()
});

// Create Master Entry
export async function createOrUpdateMasterEntry(data: z.infer<typeof MasterEntrySchema>) {
    try {
      const validatedData = MasterEntrySchema.parse(data);
  
      // Always upsert to ID 1
      const updatedEntry = await prisma.masterEntry.upsert({
        where: { id: 1 },
        update: {
          gold_16c: validatedData.gold_16k,
          gold_18c: validatedData.gold_18k,
          gold_22c: validatedData.gold_22k,
          gold_24c: validatedData.gold_24k,
          silver_pure: validatedData.silver_pure,
          silver_ornamental: validatedData.silver_ornamental,
          remarks: validatedData.remarks
        },
        create: {
          id: 1,  // Force ID to be 1
          gold_16c: validatedData.gold_16k,
          gold_18c: validatedData.gold_18k,
          gold_22c: validatedData.gold_22k,
          gold_24c: validatedData.gold_24k,
          silver_pure: validatedData.silver_pure,
          silver_ornamental: validatedData.silver_ornamental,
          remarks: validatedData.remarks
        }
      });
  
      console.log('Master Entry Updated:', updatedEntry);
      return updatedEntry;
    } catch (error) {
      console.error('Create/Update Master Entry Error:', error);
      throw error;
    }
  }

// Update Master Entry
export async function updateMasterEntry(id: number, data: z.infer<typeof MasterEntrySchema>) {
  try {
    const validatedData = MasterEntrySchema.parse(data);

    return await prisma.masterEntry.update({
      where: { id },
      data: {
        gold_16c: validatedData.gold_16k,
        gold_18c: validatedData.gold_18k,
        gold_22c: validatedData.gold_22k,
        gold_24c: validatedData.gold_24k,
        silver_pure: validatedData.silver_pure,
        silver_ornamental: validatedData.silver_ornamental,
        remarks: validatedData.remarks
      }
    });
  } catch (error) {
    console.error('Update Master Entry Error:', error);
    throw error;
  }
}

// Get Latest Master Entry with Detailed Logging
export async function getLatestMasterEntry() {
    try {
      const latestEntry = await prisma.masterEntry.findFirst({
        orderBy: { created_at: 'desc' },
        take: 1
      });
  
      console.log('Latest Master Entry Retrieved:', latestEntry);
      return latestEntry;
    } catch (error) {
      console.error('Get Latest Master Entry Error:', error);
      throw error;
    }
  }

// Get Master Entry by ID
export async function getMasterEntryById(id: number) {
    try {
      const entry = await prisma.masterEntry.findUnique({
        where: { id }
      });
  
      if (!entry) {
        console.log(`No entry found with ID ${id}. Creating default.`);
        return null;
      }
  
      return entry;
    } catch (error) {
      console.error('Get Master Entry by ID Error:', error);
      throw error;
    }
  }

// List Master Entries with Pagination
export async function listMasterEntries(page = 1, pageSize = 10) {
  try {
    const skip = (page - 1) * pageSize;

    const [total, entries] = await Promise.all([
      prisma.masterEntry.count(),
      prisma.masterEntry.findMany({
        skip,
        take: pageSize,
        orderBy: { created_at: 'desc' }
      })
    ]);

    return {
      total,
      page,
      pageSize,
      entries
    };
  } catch (error) {
    console.error('List Master Entries Error:', error);
    throw error;
  }
}

// Delete Master Entry
export async function deleteMasterEntry(id: number) {
  try {
    return await prisma.masterEntry.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Delete Master Entry Error:', error);
    throw error;
  }
}