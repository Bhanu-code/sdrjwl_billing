
const salepos = () => {
  return (
    <div className="m-4">
    <div className="actions">
      {/* <CreatePOSModal onPOSCreated={handlePOSCreated} /> */}
    </div>
    <div className="data-table">
      <POSTable refreshTable={refreshTable} />
    </div>
  </div>
  )
}

export default salepos