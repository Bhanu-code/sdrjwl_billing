import  { useState, useEffect } from 'react';
// import { invoke } from '@tauri-apps/api/core';
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
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { useToast } from "~/components/ui/toast";
import InvoiceModal from '~/components/InvoiceModal';




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
  net_weight: number;
  making_charges: number;
  sales_total: number;
  discount_percent: number;
  total_rate: number;
  gst_type: 'gst' | 'igst';
  total_amount: number;
  created_at: string;
}

interface POSTableProps {
  refreshTable: boolean;
}

export function SalesPOSTable({ refreshTable }: POSTableProps) {
  const [salesPos, setSalesPOS] = useState<SalesPOS[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSale, setSelectedSale] = useState<SalesPOS | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const { toast } = useToast();
  

  const [updateFormData, setUpdateFormData] = useState<Partial<SalesPOS>>({});

  const fetchSalesPOS = async () => {
    // try {
    //   const data = await invoke<SalesPOS[]>('get_sales_pos');
    //   setSalesPOS(data);
    //   setLoading(false);
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : String(err));
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    fetchSalesPOS();
  }, [refreshTable]); 
  const calculateGSTDetails = (sale: SalesPOS) => {
    // Calculate taxable value (total before GST)
    const taxableValue = sale.total_rate;
    
    // GST Calculation Logic
    if (sale.gst_type === 'gst') {
      // For CGST & SGST (Intra-state supply)
      const cgstRate = 0.015; // 1.5%
      const sgstRate = 0.015; // 1.5%
      
      const cgstAmount = taxableValue * cgstRate;
      const sgstAmount = taxableValue * sgstRate;
      
      return {
        gstType: 'CGST & SGST',
        cgstRate: cgstRate * 100,
        sgstRate: sgstRate * 100,
        cgstAmount,
        sgstAmount,
        totalGST: cgstAmount + sgstAmount,
        totalAmount: taxableValue + cgstAmount + sgstAmount
      };
    } else {
      // For IGST (Inter-state supply)
      const igstRate = 0.03; // 3%
      
      const igstAmount = taxableValue * igstRate;
      
      return {
        gstType: 'IGST',
        igstRate: igstRate * 100,
        igstAmount,
        totalGST: igstAmount,
        totalAmount: taxableValue + igstAmount
      };
    }
  };

  const handlePrintInvoice = (sale: SalesPOS) => {
    setSelectedSale(sale);
    setIsPrintModalOpen(true);
  };

  // Handler for update form changes
  const handleUpdateFormChange = (field: keyof SalesPOS, value: string | number) => {
    setUpdateFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler for update submission
  const handleUpdateSubmit = async () => {
    if (!selectedSale) return;

    try {
      // Implement update logic using Tauri invoke
      // This is a placeholder - you'll need to implement the actual update backend function
      console.log('Updating sale:', {
        ...selectedSale,
        ...updateFormData
      });

      // Refresh sales list or update specific sale in the list
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error('Failed to update sale:', error);
    }
  };

  // Handler to open delete confirmation modal
  const handleOpenDeleteModal = (sale: SalesPOS) => {
    setSelectedSale(sale);
    setIsDeleteModalOpen(true);
  };

  // Handler for delete confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedSale) return;
  
    // try {
    //   // Pass an object with product_code matching the backend expectation
    //   await invoke('delete_sales_pos', { 
    //     params: {
    //       product_code: selectedSale.product_code 
    //     }
    //   });
      
    //   // Remove the sale from the local state
    //   setSalesPOS(salesPos.filter(s => s.product_code !== selectedSale.product_code));
      
    //   // Close the delete modal
    //   setIsDeleteModalOpen(false);
      
    //   // Show success toast
    //   toast({
    //     title: "Success",
    //     description: "Sale deleted successfully",
    //     variant: "success"
    //   });
    // } catch (error) {
    //   console.error('Failed to delete sale:', error);
      
    //   // Show error toast
    //   toast({
    //     title: "Error",
    //     description: "Failed to delete sale",
    //     variant: "destructive"
    //   });
    // }
  };

  // Handler to open detail modal
  const handleViewDetails = (sale: SalesPOS) => {
    setSelectedSale(sale);
    setIsDetailModalOpen(true);
  };


  // Calculate total amount
  const totalAmount = salesPos.reduce((sum, sale) => sum + sale.total_amount, 0);

  if (loading) {
    return <div>Loading sales data...</div>;
  }

  if (error) {
    return <div>Error loading sales data: {error}</div>;
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
          {salesPos?.map((sale) => (
            <TableRow key={sale.product_code}>
              <TableCell>{sale.product_code}</TableCell>
              <TableCell>{sale.product_name}</TableCell>
              <TableCell>{sale.customer_name || 'N/A'}</TableCell>
              <TableCell>{sale.net_weight.toFixed(2)}</TableCell>
              <TableCell>₹{sale.total_amount.toFixed(2)}</TableCell>
              <TableCell>{new Date(sale.created_at).toLocaleString()}</TableCell>
              <TableCell>
              <div className="flex space-x-2">
                  {/* View Details Button */}
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleViewDetails(sale)}
                    className="h-8 w-8"
                  >
                    <FaEye className="h-4 w-4" />
                  </Button>
                  
                  {/* Print Invoice Button */}
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handlePrintInvoice(sale)}
                    className="h-8 w-8"
                  >
                    <FaPrint className="h-4 w-4" />
                  </Button>
                  
                  {/* Delete Button */}
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
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total Sales</TableCell>
            <TableCell className="text-right">₹{totalAmount.toFixed(2)}</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {/* Detail Modal */}
      {selectedSale && (
        <Dialog 
          open={isDetailModalOpen} 
          onOpenChange={setIsDetailModalOpen}
        >
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center">
                <FaReceipt className="mr-3 text-blue-600" />
                Sales Invoice Details
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Comprehensive details for Product Code: {selectedSale.product_code}
              </DialogDescription>
            </DialogHeader>
            
            <div className="border-b border-gray-200 my-4"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information Card */}
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

              {/* Product Details Card */}
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
                    <span className="text-gray-500">Net Weight</span>
                    <span className="font-medium">{selectedSale.net_weight.toFixed(2)} gm</span>
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
                </div>
              </div>

              {/* GST Details Card */}
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
            {/* Contact Number */}
            <div>
              <Label>Contact Number</Label>
              <Input 
                value={updateFormData.contact_number || ''} 
                onChange={(e) => handleUpdateFormChange('contact_number', e.target.value)}
              />
            </div>

            {/* Customer Name */}
            <div>
              <Label>Customer Name</Label>
              <Input 
                value={updateFormData.customer_name || ''} 
                onChange={(e) => handleUpdateFormChange('customer_name', e.target.value)}
              />
            </div>

            {/* GSTIN No */}
            <div>
              <Label>GSTIN No</Label>
              <Input 
                value={updateFormData.gstin_no || ''} 
                onChange={(e) => handleUpdateFormChange('gstin_no', e.target.value)}
              />
            </div>

            {/* Product Name */}
            <div>
              <Label>Product Name</Label>
              <Input 
                value={updateFormData.product_name || ''} 
                onChange={(e) => handleUpdateFormChange('product_name', e.target.value)}
              />
            </div>

            {/* Net Weight */}
            <div>
              <Label>Net Weight</Label>
              <Input 
                type="number"
                value={updateFormData.net_weight || 0} 
                onChange={(e) => handleUpdateFormChange('net_weight', parseFloat(e.target.value))}
              />
            </div>

            {/* Making Charges */}
            <div>
              <Label>Making Charges</Label>
              <Input 
                type="number"
                value={updateFormData.making_charges || 0} 
                onChange={(e) => handleUpdateFormChange('making_charges', parseFloat(e.target.value))}
              />
            </div>

            {/* Discount Percent */}
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

      {/* Delete Confirmation Modal */}
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
        />
      )}

    </>
  );
}

export default SalesPOSTable;