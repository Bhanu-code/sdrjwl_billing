import { useState, useEffect } from "react";
// import { invoke } from '@tauri-apps/api/core';
import {
  FaEye,
  FaTrash,
  FaCoins,
  FaBalanceScale,
  FaBarcode,
  FaCalendar,
  FaUser,
  FaPrint,
} from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { useToast } from "~/components/ui/toast";
import { Form } from "@remix-run/react";
import { Input } from "./ui/input";

// Define the Purchase type to match the backend structure
interface Purchase {
  id: number;
  purity: string;
  description: string;
  pieces: number;
  net_weight: number;
  gross_weight: number;
  gold_rate: number;
  total_amount: number;
  created_at: string;
  product_code: string;
  customer_name: string;
  customer_contact: string;
  customer_address: string;
}

interface PurchaseTableProps {
  refreshTable: boolean; // Prop to trigger refresh
}

export function PurchaseTable({ refreshTable }: any) {
  //   const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<any | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [updateFormFields, setUpdateFormFields] = useState<Partial<Purchase>>({});
  const [purchases, setPurchases] = useState<Purchase[]>([
    {
      id: 1,
      purity: "99.9",
      description: "Gold Ring",
      pieces: 1,
      net_weight: 10.5,
      gross_weight: 11.0,
      gold_rate: 5000,
      total_amount: 52447.5,
      created_at: "2023-10-01T12:00:00Z",
      product_code: "GR001",
      customer_name: "John Doe",
      customer_contact: "123-456-7890",
      customer_address: "123 Main St, Springfield",
    },
    {
      id: 2,
      purity: "91.6",
      description: "Gold Chain",
      pieces: 2,
      net_weight: 20.0,
      gross_weight: 21.0,
      gold_rate: 4800,
      total_amount: 87936.0,
      created_at: "2023-10-02T14:30:00Z",
      product_code: "GC002",
      customer_name: "Jane Smith",
      customer_contact: "987-654-3210",
      customer_address: "456 Elm St, Metropolis",
    },
    {
      id: 3,
      purity: "75.0",
      description: "Gold Bracelet",
      pieces: 1,
      net_weight: 15.0,
      gross_weight: 16.0,
      gold_rate: 4500,
      total_amount: 50625.0,
      created_at: "2023-10-03T10:15:00Z",
      product_code: "GB003",
      customer_name: "Alice Johnson",
      customer_contact: "555-123-4567",
      customer_address: "789 Oak St, Smallville",
    },
  ]);
  const { toast } = useToast();

  // Fetch purchases from backend
  const fetchPurchases = async () => {
    try {
      setLoading(true);
      //   const fetchedPurchases = await invoke<Purchase[]>('get_purchases');
      //   setPurchases(fetchedPurchases);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch purchases:", err);
      setError("Failed to load purchases");
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to fetch purchases",
        variant: "destructive",
      });
    }
  };

  // Fetch purchases on component mount and when refreshTable changes
  useEffect(() => {
    // Since we're using demo data, we don't need to fetch anything
    setLoading(false);
  }, [refreshTable]);

  const handlePrintPurchase = (_purchase: Purchase) => {
    // Basic print functionality
    window.print();
  };

  // Prepare for purchase deletion
  const handleDeleteConfirmation = (purchase: Purchase) => {
    setSelectedPurchase(purchase.id);
    setIsDeleteModalOpen(true);
  };

  // Perform purchase deletion
  const handleDeletePurchase = async () => {
    if (!selectedPurchase) return;

    try {
      //   await invoke('delete_purchase', { purchaseId: selectedPurchase.id });
      await fetchPurchases(); // Refresh the list
      setIsDeleteModalOpen(false);
      setSelectedPurchase(null);
      toast({
        title: "Success",
        description: "Purchase deleted successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to delete purchase:", error);
      toast({
        title: "Error",
        description: "Failed to delete purchase",
        variant: "destructive",
      });
    }
  };

  // Handle action buttons
  const handleShowDetails = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsDetailsModalOpen(true); // Open details modal specifically
  };

  // Fetch purchases on component mount
  useEffect(() => {
    fetchPurchases();
  }, []);

  // Loading and error states
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen w-full">
        Loading purchases...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen w-full text-red-500">
        Error: {error}
      </div>
    );

  return (
    <>
      <div className="w-full overflow-hidden p-4 bg-background">
        <div className="h-full flex flex-col">
          <div className="flex-grow overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  {/* <TableHead>Name</TableHead> */}
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Customer Contact</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Net Weight (gm)</TableHead>
                  <TableHead>Gross Weight (gm)</TableHead>
                  <TableHead>Purity</TableHead>
                  <TableHead>Pieces</TableHead>
                  <TableHead>Gold Rate</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refreshTable?.map((purchase: Purchase) => (
                  <TableRow key={purchase.id}>
                    {/* <TableCell>{purchase.description}</TableCell> */}
                    <TableCell>{purchase.customer_name}</TableCell>
                    <TableCell>{purchase.customer_contact}</TableCell>
                    <TableCell>{purchase.product_code}</TableCell>
                    <TableCell>{purchase.net_weight}</TableCell>
                    <TableCell>{purchase.gross_weight}</TableCell>
                    <TableCell>{purchase.purity}</TableCell>
                    <TableCell>{purchase.pieces}</TableCell>
                    <TableCell>{purchase.gold_rate}</TableCell>
                    <TableCell>{purchase.total_amount}</TableCell>
                    <TableCell>
                      {new Date(purchase.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleShowDetails(purchase)}
                          title="Show Details"
                          className="h-8 w-8"
                        >
                          <FaEye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePrintPurchase(purchase)}
                          title="Print Purchase"
                          className="h-8 w-8"
                        >
                          <FaPrint className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteConfirmation(purchase)}
                          title="Delete Purchase"
                          className="h-8 w-8"
                        >
                          <FaTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="sticky bottom-0 bg-background">
                <TableRow>
                  <TableCell colSpan={9}>Total Purchases</TableCell>
                  <TableCell className="text-right">
                    {purchases
                      .reduce(
                        (total, purchase) => total + purchase.total_amount,
                        0
                      )
                      .toFixed(2)}
                      
                  </TableCell>
                  <TableCell colSpan={2}></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>

      {/* Purchase Details Dialog */}
      {selectedPurchase && (
        <Dialog
          open={isDetailsModalOpen}
          onOpenChange={() => {
            setIsDetailsModalOpen(false);
            setSelectedPurchase(null);
          }}
        >
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center">
                <FaCoins className="mr-3 text-blue-600" />
                Purchase Details
              </DialogTitle>
            </DialogHeader>

            <div className="border-b border-gray-200 my-4"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Purchase Identification Card */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FaBarcode className="mr-3 text-blue-600 text-xl" />
                  <h3 className="text-lg font-semibold">
                    Purchase Identification
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Purchase Description</span>
                    <span className="font-medium">
                      {selectedPurchase.description}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Product Code</span>
                    <span className="font-medium">
                      {selectedPurchase.product_code}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Details Card */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FaUser className="mr-3 text-blue-600 text-xl" />
                  <h3 className="text-lg font-semibold">
                    Customer Information
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Customer Name</span>
                    <span className="font-medium">
                      {selectedPurchase.customer_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contact Number</span>
                    <span className="font-medium">
                      {selectedPurchase.customer_contact}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Address</span>
                    <span className="font-medium">
                      {selectedPurchase.customer_address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Weight Details Card */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FaBalanceScale className="mr-3 text-blue-600 text-xl" />
                  <h3 className="text-lg font-semibold">Weight Details</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Net Weight</span>
                    <span className="font-medium">
                      {selectedPurchase.net_weight} gm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gross Weight</span>
                    <span className="font-medium">
                      {selectedPurchase.gross_weight} gm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pieces</span>
                    <span className="font-medium">
                      {selectedPurchase.pieces}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Details Card */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FaCoins className="mr-3 text-blue-600 text-xl" />
                  <h3 className="text-lg font-semibold">
                    Financial Information
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gold Rate</span>
                    <span className="font-medium">
                      ₹{selectedPurchase.gold_rate.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Amount</span>
                    <span className="font-medium">
                      ₹{selectedPurchase.total_amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Purity</span>
                    <span className="font-medium">
                      {selectedPurchase.purity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Details Card */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FaCalendar className="mr-3 text-blue-600 text-xl" />
                  <h3 className="text-lg font-semibold">
                    Additional Information
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Creation Date</span>
                    <span className="font-medium">
                      {new Date(selectedPurchase.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onOpenChange={() => {
          setIsDeleteModalOpen(false);
          setSelectedPurchase(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the purchase "
              {selectedPurchase?.customer_name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Form method="post">
              <Input className="hidden" name="form_type" value="delete-form" />
              <Input className="hidden" name="purchaseId" value={selectedPurchase} />
              <Button
                variant="destructive"
                type="submit"
                // onClick={handleDeletePurchase}
              >
                Delete
              </Button>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PurchaseTable;
