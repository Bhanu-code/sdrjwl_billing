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
    <div className="m-3 h-[calc(100vh-150px)] flex flex-col">
      <div className="actions mb-4">
        <PurchaseModal />
      </div>
      <div className="table flex-grow overflow-y-auto">
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
    await createPurchase(userData);
    return { success: true }; // Return success flag
  } else if (formType === "delete-form") {
    await deletePurchaseById(Number(userData.purchaseId));
    return { success: true }; // Return success flag
  }
}

export default Purchase


