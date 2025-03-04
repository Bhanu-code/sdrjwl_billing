import {
  FaEye,
  FaMoneyBillWave,
  FaPrint,
  FaReceipt,
  FaShoppingBag,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const POSTable = () => {
  const salesPos: any = [];
  const selectedSale: any = [];

  const calculateGSTDetails = (sale: any) => {
    // Calculate taxable value (total before GST)
    const taxableValue = sale.total_rate;

    // GST Calculation Logic
    if (sale.gst_type === "gst") {
      // For CGST & SGST (Intra-state supply)
      const cgstRate = 0.015; // 1.5%
      const sgstRate = 0.015; // 1.5%

      const cgstAmount = taxableValue * cgstRate;
      const sgstAmount = taxableValue * sgstRate;

      return {
        gstType: "CGST & SGST",
        cgstRate: cgstRate * 100,
        sgstRate: sgstRate * 100,
        cgstAmount,
        sgstAmount,
        totalGST: cgstAmount + sgstAmount,
        totalAmount: taxableValue + cgstAmount + sgstAmount,
      };
    }

    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Code</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Net Weight (gm)</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesPos.map((sale: any) => (
              <TableRow key={sale.product_code}>
                <TableCell>{sale.product_code}</TableCell>
                <TableCell>{sale.product_name}</TableCell>
                <TableCell>{sale.customer_name || "N/A"}</TableCell>
                <TableCell>{sale.net_weight.toFixed(2)}</TableCell>
                <TableCell>₹{sale.total_amount.toFixed(2)}</TableCell>
                <TableCell>
                  {new Date(sale.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {/* View Details Button */}
                    <Button
                      variant="outline"
                      size="icon"
                      //   onClick={() => handleViewDetails(sale)}
                      className="h-8 w-8"
                    >
                      <FaEye className="h-4 w-4" />
                    </Button>

                    {/* Print Invoice Button */}
                    <Button
                      variant="outline"
                      size="icon"
                      //   onClick={() => handlePrintInvoice(sale)}
                      className="h-8 w-8"
                    >
                      <FaPrint className="h-4 w-4" />
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      size="icon"
                      //   onClick={() => handleOpenDeleteModal(sale)}
                      className="h-8 w-8"
                    >
                      <FaTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total Sales</TableCell>
              {/* <TableCell className="text-right">₹{totalAmount?.toFixed(2)}</TableCell> */}
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {/* Detail Modal */}
        {selectedSale && (
          <Dialog
          // open={isDetailModalOpen}
          // onOpenChange={setIsDetailModalOpen}
          >
            <DialogContent className="sm:max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center">
                  <FaReceipt className="mr-3 text-blue-600" />
                  Sales Invoice Details
                </DialogTitle>
                <DialogDescription className="text-gray-500">
                  Comprehensive details for Product Code:{" "}
                  {selectedSale.product_code}
                </DialogDescription>
              </DialogHeader>

              <div className="border-b border-gray-200 my-4"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information Card */}
                <div className="bg-white shadow-md rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <FaUser className="mr-3 text-blue-600 text-xl" />
                    <h3 className="text-lg font-semibold">
                      Customer Information
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name</span>
                      <span className="font-medium">
                        {selectedSale.customer_name || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contact</span>
                      <span className="font-medium">
                        {selectedSale.contact_number || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">GSTIN</span>
                      <span className="font-medium">
                        {selectedSale.gstin_no || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Details Card */}
                <div className="bg-white shadow-md rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <FaShoppingBag className="mr-3 text-blue-600 text-xl" />
                    <h3 className="text-lg font-semibold">Product Details</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Product Name</span>
                      <span className="font-medium">
                        {selectedSale.product_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Unit</span>
                      <span className="font-medium">{selectedSale.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Net Weight</span>
                      <span className="font-medium">
                        {selectedSale.net_weight.toFixed(2)} gm
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financial Details Card */}
                <div className="bg-white shadow-md rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <FaMoneyBillWave className="mr-3 text-blue-600 text-xl" />
                    <h3 className="text-lg font-semibold">Financial Details</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gold Price</span>
                      <span className="font-medium">
                        ₹{selectedSale.gold_price}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Making Charges</span>
                      <span className="font-medium">
                        ₹{selectedSale.making_charges}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sales Total</span>
                      <span className="font-medium">
                        ₹{selectedSale.sales_total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* GST Details Card */}
                <div className="bg-white shadow-md rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <FaReceipt className="mr-3 text-blue-600 text-xl" />
                    <h3 className="text-lg font-semibold">GST Breakdown</h3>
                  </div>
                  {(() => {
                    const gstDetails: any = calculateGSTDetails(selectedSale);

                    return (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">GST Type</span>
                          {/* <span className="font-medium">{gstDetails.gstType}</span> */}
                        </div>

                        {gstDetails.gstType === "CGST & SGST" ? (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-500">CGST Rate</span>
                              <span className="font-medium">
                                {gstDetails.cgstRate ?? 0}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">CGST Amount</span>
                              <span className="font-medium">
                                ₹{(gstDetails.cgstAmount ?? 0).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">SGST Rate</span>
                              <span className="font-medium">
                                {gstDetails.sgstRate ?? 0}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">SGST Amount</span>
                              <span className="font-medium">
                                ₹{(gstDetails.sgstAmount ?? 0).toFixed(2)}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-500">IGST Rate</span>
                              <span className="font-medium">
                                {gstDetails.igstRate ?? 0}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">IGST Amount</span>
                              <span className="font-medium">
                                ₹{(gstDetails.igstAmount ?? 0).toFixed(2)}
                              </span>
                            </div>
                          </>
                        )}

                        <div className="border-b border-gray-200 my-2"></div>

                        <div className="flex justify-between font-bold">
                          <span>Total GST</span>
                          <span>₹{gstDetails.totalGST.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-blue-600">
                          <span>Total Amount (Inc. GST)</span>
                          <span>₹{gstDetails.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <Dialog
        //   open={isUpdateModalOpen}
        //   onOpenChange={setIsUpdateModalOpen}
        >
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Update Sales Entry</DialogTitle>
              <DialogDescription>
                Modify details for Product Code: {selectedSale?.product_code}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              {/* Contact Number */}
              <div>
                <Label>Contact Number</Label>
                <Input
                // value={updateFormData.contact_number || ''}
                // onChange={(e) => handleUpdateFormChange('contact_number', e.target.value)}
                />
              </div>

              {/* Customer Name */}
              <div>
                <Label>Customer Name</Label>
                <Input
                // value={updateFormData.customer_name || ''}
                // onChange={(e) => handleUpdateFormChange('customer_name', e.target.value)}
                />
              </div>

              {/* GSTIN No */}
              <div>
                <Label>GSTIN No</Label>
                <Input
                // value={updateFormData.gstin_no || ''}
                // onChange={(e) => handleUpdateFormChange('gstin_no', e.target.value)}
                />
              </div>

              {/* Product Name */}
              <div>
                <Label>Product Name</Label>
                <Input
                // value={updateFormData.product_name || ''}
                // onChange={(e) => handleUpdateFormChange('product_name', e.target.value)}
                />
              </div>

              {/* Net Weight */}
              <div>
                <Label>Net Weight</Label>
                <Input
                  type="number"
                  // value={updateFormData.net_weight || 0}
                  // onChange={(e) => handleUpdateFormChange('net_weight', parseFloat(e.target.value))}
                />
              </div>

              {/* Making Charges */}
              <div>
                <Label>Making Charges</Label>
                <Input
                  type="number"
                  // value={updateFormData.making_charges || 0}
                  // onChange={(e) => handleUpdateFormChange('making_charges', parseFloat(e.target.value))}
                />
              </div>

              {/* Discount Percent */}
              <div>
                <Label>Discount Percent</Label>
                <Input
                  type="number"
                  // value={updateFormData.discount_percent || 0}
                  // onChange={(e) => handleUpdateFormChange('discount_percent', parseFloat(e.target.value))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                // onClick={() => setIsUpdateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
              // onClick={handleUpdateSubmit}
              >
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog
        // open={isDeleteModalOpen}
        // onOpenChange={setIsDeleteModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this sales entry?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                variant="outline"
                // onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                // onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* {selectedSale && (
      <InvoiceModal 
        isOpen={isPrintModalOpen}
        onOpenChange={setIsPrintModalOpen}
        saleData={selectedSale}
      />
    )} */}
      </>
    );
  };
};

export default POSTable;
