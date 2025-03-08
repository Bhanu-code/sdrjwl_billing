import { prisma } from "~/data/database.server";

export async function saveCompanyInfo(userData: any) {
  try {
    const existingUser = await prisma.company.findFirst({
      where: { company_name: userData.company_name },
    });

    if (existingUser) {
      return { status: 401, msg: "Company Already Registered" };
    }

    const isSaved = await prisma.company.create({
      data: {
        company_name: userData.company_name,
        logo_url: " ",
        city: userData.city,
        district: userData.district,
        state: userData.state,
        contact_no: userData.contact_no,
        gstin_no: userData.gstin_no,
        upi_id: userData.upi_id, // Fixed: was using gstin_no
        bis_reg_no: userData.bis_reg_no,
        pan_no: userData.pan_no, // Fixed: was using bis_reg_no
      },
    });

    if (isSaved) {
      return { status: 201, msg: "Company Created" };
    } else {
      return { status: 401, msg: "Failed to Create Company" };
    }
  } catch (error) {
    console.error("Error saving company info:", error);
    return { status: 500, msg: "Internal Server Error" };
  }
}

export async function editCompanyInfo(userData: any) {
  try {
    const isSaved = await prisma.company.update({
      where: {
        id: Number(userData.id) || 1, // Convert to number and use the ID from the form
      },
      data: {
        company_name: userData.company_name,
        logo_url: " ", // This should be updated when file handling is implemented
        city: userData.city,
        district: userData.district,
        state: userData.state,
        contact_no: userData.contact_no,
        gstin_no: userData.gstin_no,
        upi_id: userData.upi_id, // Fixed: was using gstin_no
        bis_reg_no: userData.bis_reg_no,
        pan_no: userData.pan_no, // Fixed: was using bis_reg_no
      },
    });

    if (isSaved) {
      return { status: 201, msg: "Company Details Saved" };
    } else {
      return { status: 401, msg: "Failed to Save Details" };
    }
  } catch (error) {
    console.error("Error editing company info:", error);
    return { status: 500, msg: "Internal Server Error" };
  }
}

export async function getCompanyInfo() {
  try {
    const companyInfo = await prisma.company.findFirst();
    return companyInfo;
  } catch (error) {
    console.error("Error fetching company info:", error);
    return null;
  }
}