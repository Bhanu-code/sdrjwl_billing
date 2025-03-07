
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { CustomerTable } from "../components/Customer/CustomerTable";
import { addCustomer, deleteCustomerById, getAllCustomer, updateCustomer } from "~/data/customer.server";
import { editCompanyInfo } from "~/data/company.server";
import { useLoaderData } from "@remix-run/react";

const customer = () => {
  const allCustomers:any = useLoaderData()

  // console.log("All Customers", allCustomers)

  return (
    // <div className="border border-red-600">
      <div className="customer-table">
        <CustomerTable data={allCustomers} />
      </div>
    // </div>
  );
};

export async function loader({request}:LoaderFunctionArgs) {
  return await getAllCustomer()
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const userData = Object.fromEntries(formData);

  const formType: any = userData?.form_type;

  if (formType === "add-form") {
    return addCustomer(userData);
  } else if(formType === "delete-form"){
    return deleteCustomerById(Number(userData.customerId))
  }
  else if(formType === "update-form"){
    return updateCustomer(userData, Number(userData.customerId));
  }

}


export default customer;