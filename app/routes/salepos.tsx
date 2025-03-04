import POSTable from "~/components/POS/POSTable"


const salepos = () => {
  return (
    <div className="m-4">
    <div className="actions">
      {/* <CreatePOSModal onPOSCreated={handlePOSCreated} /> */}
    </div>
    <div className="data-table">
      <POSTable />
    </div>
  </div>
  )
}

export default salepos