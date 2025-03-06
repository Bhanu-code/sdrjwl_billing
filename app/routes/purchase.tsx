// import InvoiceModal from "@/components/InvoiceModal"
import PurchaseModal from "~/components/PurchaseModal"
import { PurchaseTable } from "~/components/PurchaseTable"
import { useState } from "react";


const Purchase = () => {
  const [refreshTable, setRefreshTable] = useState(false);

  // Function to refresh the table
  const handlePurchaseCreated = () => {
    setRefreshTable(prev => !prev); // Toggle state to trigger useEffect in PurchaseTable
  };

  return (
    <div className="m-3">
      <div className="actions">
        <PurchaseModal onPurchaseCreated={handlePurchaseCreated} />
      </div>
      <div className="table w-full">
        <PurchaseTable refreshTable={refreshTable} />
      </div>
    </div>
  );
};

export default Purchase


