import { prisma } from "~/data/database.server";

export async function addCustomer(userData: any) {
  const existingUser = await prisma.customer.findFirst({
    where: { name: userData.name },
  });

  if (existingUser) {
    return { status: 401, msg: "Customer Already Registered" };
  }

  const isSaved = await prisma.customer.create({
    data: {
      name: userData.name,
      address: userData.address,
      city: userData.city,
      district: userData.district,
      state: userData.state,
      contact_no: userData.contact_no,
      gstin_no: userData.gstin_no,
      upi_id: userData.upi_id,
      pan_no: userData.pan_no,
      pincode: userData.pincode,
    },
  });

  if (isSaved) {
    return { status: 201, msg: "User Created" };
  } else {
    return { status: 401, msg: "Failed to Create User" };
  }
}

export async function updateCustomer(userData: any, id: any) {
  const customer = await prisma.customer.findFirst({
    where: {
      id: id,
    },
  });

  if (!customer) {
    return { status: 401, msg: "Customer Not Found!" };
  }

  const isSaved = await prisma.customer.update({
    where: {
      id: customer.id,
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
    return { status: 201, msg: "Company Detials Saved" };
  } else {
    return { status: 401, msg: "Failed to Save Details" };
  }
}

export async function getAllCustomer() {
  const allCustomers = await prisma.customer.findMany();

  return allCustomers;
}
export async function getCustomerById(id: any) {
  const customerInfo = await prisma.customer.findFirst({
    where: {
      id: id,
    },
  });

  return customerInfo;
}
export async function deleteCustomerById(id: any) {
  const customerInfo = await prisma.customer.delete({
    where: {
      id: id,
    },
  });

  return customerInfo;
}
