import { prisma } from "~/data/database.server";

export async function saveCompanyInfo(userData: any) {
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
      upi_id: userData.gstin_no,
      bis_reg_no: userData.bis_reg_no,
      pan_no: userData.bis_reg_no,
    },
  });

  if (isSaved) {
    return { status: 201, msg: "Company Created" };
  } else {
    return { status: 401, msg: "Failed to Create Company" };
  }
}

export async function editCompanyInfo(userData: any) {
//   const existingUser = await prisma.company.findFirst({
//     where: { company_name: userData.company_name },
//   });

//   if (!existingUser) {
//     return { status: 401, msg: "Company Not Registered" };
//   }

  const isSaved = await prisma.company.update({
    where: {
      id: 1,
    },
    data: {
      company_name: userData.company_name,
      logo_url: " ",
      city: userData.city,
      district: userData.district,
      state: userData.state,
      contact_no: userData.contact_no,
      gstin_no: userData.gstin_no,
      upi_id: userData.gstin_no,
      bis_reg_no: userData.bis_reg_no,
      pan_no: userData.bis_reg_no,
    },
  });

  if (isSaved) {
    return { status: 201, msg: "Company Detials Saved" };
  } else {
    return { status: 401, msg: "Failed to Save Details" };
  }
}

export async function getCompanyInfo() {
  const companyInfo = await prisma.company.findFirst();

  return companyInfo;
}
