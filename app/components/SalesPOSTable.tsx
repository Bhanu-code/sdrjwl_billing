import { useEffect, useState } from 'react';
import {
  FaEye,
  FaTrash,
  FaUser,
  FaShoppingBag,
  FaMoneyBillWave,
  FaReceipt,
  FaPrint
} from 'react-icons/fa';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/toast";
import InvoiceModal from '~/components/InvoiceModal';
import { useFetcher } from '@remix-run/react';

// Define the type for SalesPOS based on the Rust struct
interface SalesPOS {
  id?: number;
  contact_number?: string;
  customer_id?: string;
  customer_name?: string;
  gstin_no?: string;
  product_code: string;
  product_name: string;
  live_rate: boolean;
  gold_price: number;
  manual_rate?: number | null;
  unit: string;
  gross_weight: number;
  net_weight: number;
  making_charges: number;
  sales_total: number;
  discount_percent: number;
  total_rate: number;
  gst_type: 'gst' | 'igst';
  total_amount: number;
  created_at: string;
  barcode_number?: string;
  other_charges?: number;
  reference?: string;
  pay_mode?: string;
  cash_adjustment?: number;
  purity: string | null;
}

interface POSTableProps {
  data: SalesPOS[];
  companyData: CompanyInvoiceDetails;
}

export function SalesPOSTable({ data, companyData }: POSTableProps) {
  const [salesPos, setSalesPOS] = useState<SalesPOS[]>(data || []);
  const [selectedSale, setSelectedSale] = useState<SalesPOS | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const { toast } = useToast();
  const fetcher = useFetcher();

  const [updateFormData, setUpdateFormData] = useState<Partial<SalesPOS>>({});

  const calculateGSTDetails = (sale: SalesPOS) => {
    // Calculate taxable value (before GST)
    const taxableValue = sale.sales_total * (1 - sale.discount_percent / 100);

    if (sale.gst_type === 'gst') {
      const cgstRate = 0.015; // 1.5%
      const sgstRate = 0.015; // 1.5%

      // Calculate CGST and SGST amounts
      const cgstAmount = taxableValue * cgstRate;
      const sgstAmount = taxableValue * sgstRate;

      // Calculate total rate (taxable value + GST)
      const totalRate = taxableValue + cgstAmount + sgstAmount;

      // Calculate total amount (total rate + other charges - cash adjustment)
      const totalAmount = totalRate + (sale.other_charges || 0) - (sale.cash_adjustment || 0);

      return {
        gstType: 'CGST & SGST',
        cgstRate: cgstRate * 100,
        sgstRate: sgstRate * 100,
        cgstAmount,
        sgstAmount,
        totalGST: cgstAmount + sgstAmount,
        totalRate, // Include total rate in the return object
        totalAmount, // Include total amount in the return object
      };
    } else {
      const igstRate = 0.03; // 3%

      // Calculate IGST amount
      const igstAmount = taxableValue * igstRate;

      // Calculate total rate (taxable value + GST)
      const totalRate = taxableValue + igstAmount;

      // Calculate total amount (total rate + other charges - cash adjustment)
      const totalAmount = totalRate + (sale.other_charges || 0) - (sale.cash_adjustment || 0);

      return {
        gstType: 'IGST',
        igstRate: igstRate * 100,
        igstAmount,
        totalGST: igstAmount,
        totalRate, // Include total rate in the return object
        totalAmount, // Include total amount in the return object
      };
    }
  };

  const handlePrintInvoice = (sale: SalesPOS) => {
    setSelectedSale(sale);
    setIsPrintModalOpen(true);
  };

  const handleUpdateFormChange = (field: keyof SalesPOS, value: string | number) => {
    setUpdateFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateSubmit = () => {
    if (!selectedSale) return;

    fetcher.submit(
      {
        ...updateFormData,
        id: selectedSale.id?.toString() || "",
        intent: "update"
      },
      { method: "POST" }
    );

    // Close the modal only if the submission was successful
    if (fetcher.state === "idle" && !fetcher.data?.error) {
      setIsUpdateModalOpen(false);
      toast({
        title: "Success",
        description: "Sale updated successfully",
      });

      // Update the local state if the submission was successful
      if (selectedSale.id) {
        setSalesPOS(prevSales =>
          prevSales.map(sale =>
            sale.id === selectedSale.id ? { ...sale, ...updateFormData } : sale
          )
        );
      }
    }
  };

  const handleOpenDeleteModal = (sale: SalesPOS) => {
    setSelectedSale(sale);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedSale || !selectedSale.id) return;

    fetcher.submit(
      {
        id: selectedSale.id.toString(),
        intent: "delete"
      },
      { method: "POST" }
    );
  };

  // Add this useEffect to handle the fetcher state changes
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && !fetcher.data.error && selectedSale) {
      // Only update if fetcher has completed and returned success
      if (fetcher.data.success && selectedSale.id) {
        // Update the local state
        setSalesPOS(prevSales => prevSales.filter(sale => sale.id !== selectedSale.id));

        // Close the modal
        setIsDeleteModalOpen(false);

        // Show success toast
        toast({
          title: "Success",
          description: "Sale deleted successfully",
        });
      } else if (fetcher.data.error) {
        // Show error toast
        toast({
          title: "Error",
          description: fetcher.data.error || "Failed to delete sale",
          variant: "destructive"
        });
      }
    }
  }, [fetcher.state, fetcher.data, selectedSale]);

  const handleViewDetails = (sale: SalesPOS) => {
    setSelectedSale(sale);
    setIsDetailModalOpen(true);
  };

  const handleOpenUpdateModal = (sale: SalesPOS) => {
    setSelectedSale(sale);
    setUpdateFormData({
      contact_number: sale.contact_number,
      customer_name: sale.customer_name,
      gstin_no: sale.gstin_no,
      product_name: sale.product_name,
      net_weight: sale.net_weight,
      making_charges: sale.making_charges,
      discount_percent: sale.discount_percent
    });
    setIsUpdateModalOpen(true);
  };

  const totalAmount = salesPos.reduce((sum, sale) => sum + sale.total_amount, 0);

  if (!data || data.length === 0) {
    return <div>No sales data available.</div>;
  }

  return (
    <>
    <div className="relative overflow-auto max-h-[calc(100vh-200px)] rounded-lg border">
      <Table className="w-full">
      <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow>
            <TableHead>Product Code</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Purity</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Gross Weight</TableHead>
            <TableHead>Net Weight (gm)</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto">
          {salesPos?.map((sale) => (
            <TableRow key={sale.product_code}>
              <TableCell>{sale.product_code}</TableCell>
              <TableCell>{sale.product_name}</TableCell>
              <TableCell>{sale.purity || "N/A"}</TableCell>
              <TableCell>{sale.customer_name || 'N/A'}</TableCell>
              <TableCell>{sale.gross_weight.toFixed(2)}</TableCell>
              <TableCell>{sale.net_weight.toFixed(2)}</TableCell>
              <TableCell>₹{sale.total_amount.toFixed(2)}</TableCell>
              <TableCell>{new Date(sale.created_at).toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleViewDetails(sale)}
                    className="h-8 w-8"
                  >
                    <FaEye className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePrintInvoice(sale)}
                    className="h-8 w-8"
                  >
                    <FaPrint className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleOpenDeleteModal(sale)}
                    className="h-8 w-8"
                  >
                    <FaTrash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="sticky bottom-0 bg-white">
          <TableRow>
            <TableCell colSpan={4}>Total Sales</TableCell>
            <TableCell className="text-right">₹{totalAmount.toFixed(2)}</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {selectedSale && (
        <Dialog
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
        >
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center">
                <FaReceipt className="mr-3 text-blue-600" />
                Sales Invoice Details
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Comprehensive details for Product Code: {selectedSale.product_code}
              </DialogDescription>
            </DialogHeader>

            <div className="border-b border-gray-200 "></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FaUser className="mr-3 text-blue-600 text-xl" />
                  <h3 className="text-lg font-semibold">Customer Information</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name</span>
                    <span className="font-medium">{selectedSale.customer_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contact</span>
                    <span className="font-medium">{selectedSale.contact_number || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">GSTIN</span>
                    <span className="font-medium">{selectedSale.gstin_no || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FaShoppingBag className="mr-3 text-blue-600 text-xl" />
                  <h3 className="text-lg font-semibold">Product Details</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Product Name</span>
                    <span className="font-medium">{selectedSale.product_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Unit</span>
                    <span className="font-medium">{selectedSale.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gross Weight</span>
                    <span className="font-medium">{selectedSale.gross_weight.toFixed(2)} gm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Net Weight</span>
                    <span className="font-medium">{selectedSale.net_weight.toFixed(2)} gm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Purity</span>
                    <span className="font-medium">{selectedSale.purity || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Barcode Number</span>
                    <span className="font-medium">{selectedSale.barcode_number || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FaMoneyBillWave className="mr-3 text-blue-600 text-xl" />
                  <h3 className="text-lg font-semibold">Financial Details</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gold Price</span>
                    <span className="font-medium">₹{selectedSale.gold_price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Making Charges</span>
                    <span className="font-medium">₹{selectedSale.making_charges}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sales Total</span>
                    <span className="font-medium">₹{selectedSale.sales_total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount Percent</span>
                    <span className="font-medium">{selectedSale.discount_percent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Rate</span>
                    <span className="font-medium">₹{selectedSale.total_rate.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Other Charges</span>
                    <span className="font-medium">₹{selectedSale.other_charges || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cash Adjustment</span>
                    <span className="font-medium">₹{selectedSale.cash_adjustment || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FaReceipt className="mr-3 text-blue-600 text-xl" />
                  <h3 className="text-lg font-semibold">GST Breakdown</h3>
                </div>
                {(() => {
                  const gstDetails = calculateGSTDetails(selectedSale);

                  return (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">GST Type</span>
                        <span className="font-medium">{gstDetails.gstType}</span>
                      </div>

                      {gstDetails.gstType === 'CGST & SGST' ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-500">CGST Rate</span>
                            <span className="font-medium">{gstDetails.cgstRate ?? 0}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">CGST Amount</span>
                            <span className="font-medium">₹{(gstDetails.cgstAmount ?? 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">SGST Rate</span>
                            <span className="font-medium">{gstDetails.sgstRate ?? 0}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">SGST Amount</span>
                            <span className="font-medium">₹{(gstDetails.sgstAmount ?? 0).toFixed(2)}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-500">IGST Rate</span>
                            <span className="font-medium">{gstDetails.igstRate ?? 0}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">IGST Amount</span>
                            <span className="font-medium">₹{(gstDetails.igstAmount ?? 0).toFixed(2)}</span>
                          </div>
                        </>
                      )}

                      <div className="border-b border-gray-200 my-2"></div>

                      <div className="flex justify-between font-bold">
                        <span>Total GST</span>
                        <span>₹{gstDetails.totalGST.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total Rate (Inc. GST)</span>
                        <span>₹{gstDetails.totalRate.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-blue-600">
                        <span>Total Amount (Inc. GST + Other Charges - Cash Adjustment)</span>
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
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
      >
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Update Sales Entry</DialogTitle>
            <DialogDescription>
              Modify details for Product Code: {selectedSale?.product_code}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Contact Number</Label>
              <Input
                value={updateFormData.contact_number || ''}
                onChange={(e) => handleUpdateFormChange('contact_number', e.target.value)}
              />
            </div>

            <div>
              <Label>Customer Name</Label>
              <Input
                value={updateFormData.customer_name || ''}
                onChange={(e) => handleUpdateFormChange('customer_name', e.target.value)}
              />
            </div>

            <div>
              <Label>GSTIN No</Label>
              <Input
                value={updateFormData.gstin_no || ''}
                onChange={(e) => handleUpdateFormChange('gstin_no', e.target.value)}
              />
            </div>

            <div>
              <Label>Product Name</Label>
              <Input
                value={updateFormData.product_name || ''}
                onChange={(e) => handleUpdateFormChange('product_name', e.target.value)}
              />
            </div>

            <div>
              <Label>Net Weight</Label>
              <Input
                type="number"
                value={updateFormData.net_weight || 0}
                onChange={(e) => handleUpdateFormChange('net_weight', parseFloat(e.target.value))}
              />
            </div>

            <div>
              <Label>Making Charges</Label>
              <Input
                type="number"
                value={updateFormData.making_charges || 0}
                onChange={(e) => handleUpdateFormChange('making_charges', parseFloat(e.target.value))}
              />
            </div>

            <div>
              <Label>Discount Percent</Label>
              <Input
                type="number"
                value={updateFormData.discount_percent || 0}
                onChange={(e) => handleUpdateFormChange('discount_percent', parseFloat(e.target.value))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateSubmit}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
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
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedSale && (
        <InvoiceModal
          isOpen={isPrintModalOpen}
          onOpenChange={setIsPrintModalOpen}
          saleData={selectedSale}
          companyData={companyData}
        />
      )}
</div>
    </>
  );
}

export default SalesPOSTable;