import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Edit2, Trash2, Eye, Package, Tag, Ruler, DollarSign, BarcodeIcon } from 'lucide-react';
import { useToast } from '~/components/ui/toast';
import Barcode from '~/components/barcode';

// Type definition for Product
type Product = {
  id: number;
  product_name: string;
  gross_weight: number;
  net_weight: number;
  huid_no: string | null;
  hsn_code: string;
  sales_rate: number;
  unit: string;
  making_charges: number;
  barcode: string | null;
  hallmark_no: string | null;
  other_charges: number | null;
  product_code: string;
  created_at: string;
};

interface TableDemoProps {
  products: Product[];
  fetchProducts: () => void;
}

export function ProductTable({ products, fetchProducts }: TableDemoProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [updateFormFields, setUpdateFormFields] = useState<Partial<Product>>({});
  const { toast } = useToast();

  // Handler for deleting a product
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      // Simulate a delete operation
      console.log('Deleting product:', productToDelete.id);
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
        variant: 'success',
      });
      fetchProducts(); // Refresh the product list
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  // Handler for viewing a product
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  // Handler for editing a product
  const handleEditProduct = (product: Product) => {
    setUpdateFormFields({
      id: product.id,
      product_name: product.product_name,
      gross_weight: product.gross_weight,
      net_weight: product.net_weight,
      huid_no: product.huid_no,
      hsn_code: product.hsn_code,
      sales_rate: product.sales_rate,
      unit: product.unit,
      making_charges: product.making_charges,
      barcode: product.barcode,
      hallmark_no: product.hallmark_no,
      other_charges: product.other_charges,
    });
    setIsUpdateModalOpen(true);
  };

  // Handler for updating input fields
  const handleUpdateInputChange = (key: keyof Product, value: string) => {
    setUpdateFormFields((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handler for submitting the update form
  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Simulate an update operation
      console.log('Updating product:', updateFormFields);
      toast({
        title: 'Success',
        description: 'Product updated successfully',
        variant: 'success',
      });
      fetchProducts(); // Refresh the product list
      setIsUpdateModalOpen(false);
      setUpdateFormFields({});
    } catch (error) {
      console.error('Failed to update product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      {/* Product Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Net Weight (gm)</TableHead>
            <TableHead>Gross Weight (gm)</TableHead>
            <TableHead>HUID No.</TableHead>
            <TableHead>HSN Code</TableHead>
            <TableHead>Sales Rate</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Barcode</TableHead>
            <TableHead>Making Charges</TableHead>
            <TableHead>Hallmark</TableHead>
            <TableHead>Other Charges</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.product_name}</TableCell>
              <TableCell>{product.product_code}</TableCell>
              <TableCell>{product.net_weight}</TableCell>
              <TableCell>{product.gross_weight}</TableCell>
              <TableCell>{product.huid_no || 'N/A'}</TableCell>
              <TableCell>{product.hsn_code}</TableCell>
              <TableCell>₹{product.sales_rate.toFixed(2)}</TableCell>
              <TableCell>{product.unit}</TableCell>
              <TableCell>
                {product.barcode ? (
                  <Barcode value={product.barcode} width={1} height={30} displayValue={false} />
                ) : (
                  'N/A'
                )}
              </TableCell>
              <TableCell>₹{product.making_charges.toFixed(2)}</TableCell>
              <TableCell>{product.hallmark_no || 'N/A'}</TableCell>
              <TableCell>
                {product.other_charges ? `₹${product.other_charges.toFixed(2)}` : 'N/A'}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleViewProduct(product)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleEditProduct(product)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setProductToDelete(product);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Product Details Modal */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct}  onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="sm:max-w-4xl h-[90%] overflow-scroll">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center">
                <Package className="mr-3 text-blue-600" />
                Product Details
              </DialogTitle>
            </DialogHeader>
            <div className="border-b border-gray-200 my-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Identification */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Tag className="mr-3 text-blue-600 text-xl" />
                  <h3 className="text-lg font-semibold">Product Identification</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Product Name</span>
                    <span className="font-medium">{selectedProduct.product_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Product Code</span>
                    <span className="font-medium">{selectedProduct.product_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">HSN Code</span>
                    <span className="font-medium">{selectedProduct.hsn_code}</span>
                  </div>
                </div>
              </div>

              {/* Weight and Measurement */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Ruler className="mr-3 text-blue-600 text-xl" />
                  <h3 className="text-lg font-semibold">Weight Details</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Net Weight</span>
                    <span className="font-medium">{selectedProduct.net_weight} gm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gross Weight</span>
                    <span className="font-medium">{selectedProduct.gross_weight} gm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Unit</span>
                    <span className="font-medium">{selectedProduct.unit}</span>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <DollarSign className="mr-3 text-blue-600 text-xl" />
                  <h3 className="text-lg font-semibold">Pricing Information</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sales Rate</span>
                    <span className="font-medium">₹{selectedProduct.sales_rate.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Making Charges</span>
                    <span className="font-medium">₹{selectedProduct.making_charges.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Other Charges</span>
                    <span className="font-medium">
                      {selectedProduct.other_charges
                        ? `₹${selectedProduct.other_charges.toFixed(2)}`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <BarcodeIcon className="mr-3 text-blue-600 text-xl" />
                  <h3 className="text-lg font-semibold">Additional Information</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">HUID No.</span>
                    <span className="font-medium">{selectedProduct.huid_no || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hallmark No.</span>
                    <span className="font-medium">{selectedProduct.hallmark_no || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created At</span>
                    <span className="font-medium">
                      {new Date(selectedProduct.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Barcode Section */}
              {selectedProduct.barcode && (
                <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <BarcodeIcon className="mr-3 text-blue-600 text-xl" />
                    <h3 className="text-lg font-semibold">Barcode Details</h3>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Barcode
                      value={selectedProduct.barcode}
                      width={2}
                      height={100}
                      displayValue={true}
                      className="max-w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Update Product Modal */}
      <Dialog
        open={isUpdateModalOpen}
        onOpenChange={() => {
          setIsUpdateModalOpen(false);
          setUpdateFormFields({});
        }}
      >
        <DialogContent className="sm:max-w-[1000px]">
          <DialogHeader>
            <DialogTitle className="text-blue-700 flex items-center">
              <Edit2 className="mr-3 text-blue-600" />
              Update Product
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitUpdate}>
            <div className="grid grid-cols-3 gap-5 justify-between">
              {/* Product Name */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="product_name">Product Name</Label>
                <Input
                  id="product_name"
                  value={updateFormFields.product_name || ''}
                  onChange={(e) => handleUpdateInputChange('product_name', e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Gross Weight */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="gross_weight">Gross Weight (gm)</Label>
                <Input
                  id="gross_weight"
                  type="number"
                  value={updateFormFields.gross_weight || ''}
                  onChange={(e) => handleUpdateInputChange('gross_weight', e.target.value)}
                  placeholder="Enter gross weight"
                  required
                />
              </div>

              {/* Net Weight */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="net_weight">Net Weight (gm)</Label>
                <Input
                  id="net_weight"
                  type="number"
                  value={updateFormFields.net_weight || ''}
                  onChange={(e) => handleUpdateInputChange('net_weight', e.target.value)}
                  placeholder="Enter net weight"
                  required
                />
              </div>

              {/* HSN Code */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="hsn_code">HSN Code</Label>
                <Input
                  id="hsn_code"
                  value={updateFormFields.hsn_code || ''}
                  onChange={(e) => handleUpdateInputChange('hsn_code', e.target.value)}
                  placeholder="Enter HSN code"
                  required
                />
              </div>

              {/* Sales Rate */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="sales_rate">Sales Rate</Label>
                <Input
                  id="sales_rate"
                  type="number"
                  value={updateFormFields.sales_rate || ''}
                  onChange={(e) => handleUpdateInputChange('sales_rate', e.target.value)}
                  placeholder="Enter sales rate"
                  required
                />
              </div>

              {/* Unit */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={updateFormFields.unit || ''}
                  onChange={(e) => handleUpdateInputChange('unit', e.target.value)}
                  placeholder="Enter unit"
                  required
                />
              </div>

              {/* Making Charges */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="making_charges">Making Charges</Label>
                <Input
                  id="making_charges"
                  type="number"
                  value={updateFormFields.making_charges || ''}
                  onChange={(e) => handleUpdateInputChange('making_charges', e.target.value)}
                  placeholder="Enter making charges"
                  required
                />
              </div>

              {/* Optional Fields */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="huid_no">HUID No. (Optional)</Label>
                <Input
                  id="huid_no"
                  value={updateFormFields.huid_no || ''}
                  onChange={(e) => handleUpdateInputChange('huid_no', e.target.value)}
                  placeholder="Enter HUID number"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="hallmark_no">Hallmark No. (Optional)</Label>
                <Input
                  id="hallmark_no"
                  value={updateFormFields.hallmark_no || ''}
                  onChange={(e) => handleUpdateInputChange('hallmark_no', e.target.value)}
                  placeholder="Enter hallmark number"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="other_charges">Other Charges (Optional)</Label>
                <Input
                  id="other_charges"
                  type="number"
                  value={updateFormFields.other_charges || ''}
                  onChange={(e) => handleUpdateInputChange('other_charges', e.target.value)}
                  placeholder="Enter other charges"
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => setIsUpdateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Update Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onOpenChange={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
      >
         <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the product "{productToDelete?.product_name}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ProductTable;