// import InvoiceModal from "@/components/InvoiceModal"
import PurchaseModal from "~/components/PurchaseModal"
import { PurchaseTable } from "~/components/PurchaseTable"
import { useState } from "react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { createPurchase, deletePurchaseById, getAllPurchase } from "~/data/purchase.server";
import { useLoaderData } from "@remix-run/react";


const Purchase = () => {
  const [refreshTable, setRefreshTable] = useState(false);

  const purchases:any = useLoaderData()


  // Function to refresh the table
  const handlePurchaseCreated = () => {
    setRefreshTable(prev => !prev); // Toggle state to trigger useEffect in PurchaseTable
  };

  return (
    <div className="m-3">
      <div className="actions">
        <PurchaseModal />
      </div>
      <div className="table w-full">
        <PurchaseTable refreshTable={purchases} />
      </div>
    </div>
  );
};

export async function loader({request}:LoaderFunctionArgs) {
  return getAllPurchase()
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const userData = Object.fromEntries(formData);

  console.log("purchaseDetails", userData);

  const formType: any = userData?.form_type;

  if (formType === "create-form") {
    return createPurchase(userData);
  } else if(formType === "delete-form"){
    return deletePurchaseById(Number(userData.purchaseId))
  }
  // else if(formType === "update-form") {
  //   return updateProduct(userData, Number(userData.customerId));
  // }

}


export default Purchase


