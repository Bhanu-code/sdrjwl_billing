import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  FaUser,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  FaAddressCard
} from 'react-icons/fa';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Pencil, Trash2, Eye } from 'lucide-react';
import AddCustomerModal from '../AddCustomerModal';
import { Form } from '@remix-run/react';

// Comprehensive Customer interface
interface Customer {
  id: number;
  customer_name: string;
  address: string;
  city: string;
  state: string;
  contact_no: string;
  pincode: string;
  pan?: string | null;
  upi_id?: string | null;
  gstin?: string | null; // Add this line
}

// Type for update form fields, excluding ID
type CustomerUpdateFields = Omit<Customer, 'id'>;

// Type for form field keys
type CustomerUpdateFieldKey = keyof CustomerUpdateFields;

export function CustomerTable() {
  // Strongly typed state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  // Strongly typed update form fields
  const [updateFormFields, setUpdateFormFields] = useState<CustomerUpdateFields>({
    customer_name: '',
    address: '',
    city: '',
    state: '',
    contact_no: '',
    pincode: '',
    pan: null,
    upi_id: null
  });



  // Open customer details modal
  const handleViewDetails = (customer: Customer): void => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  // Open update customer modal
  const handleUpdateCustomer = (customer: Customer): void => {
    setUpdateFormFields({
      customer_name: customer.customer_name,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      contact_no: customer.contact_no,
      pincode: customer.pincode,
      pan: customer.pan || null,
      upi_id: customer.upi_id || null,
      gstin: customer.gstin || null, // Add this line
    });
    setSelectedCustomer(customer);
    setIsUpdateModalOpen(true);
    setIsDetailModalOpen(false);
  };

  // Handle input changes in update form
  const handleUpdateInputChange = (
    field: CustomerUpdateFieldKey,
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value;
    setUpdateFormFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate contact number
  const validateContactNumber = (contactNo: string): boolean => {
    return /^\d{10}$/.test(contactNo.trim());
  };

  // Prepare for customer deletion
  const handleDeleteConfirmation = (customer: Customer): void => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-4">

      <div className="mb-4">
        <AddCustomerModal onCustomerAdded={()=>{}} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Contact No.</TableHead>
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Pincode</TableHead>
            <TableHead>GSTIN</TableHead> {/* Add this line */}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.customer_name}</TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell>{customer.contact_no}</TableCell>
              <TableCell>{customer.city}</TableCell>
              <TableCell>{customer.state}</TableCell>
              <TableCell>{customer.pincode}</TableCell>
              <TableCell>{customer.gstin || 'N/A'}</TableCell> {/* Add this line */}
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleViewDetails(customer)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateCustomer(customer)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteConfirmation(customer)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>

      {/* Customer Details Modal */}
      {selectedCustomer && (
  <Dialog open={isDetailModalOpen} onOpenChange={() => setSelectedCustomer(null)}>
    <DialogContent className="sm:max-w-4xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold flex items-center">
          <FaUser className="mr-3 text-blue-600" />
          Customer Details
        </DialogTitle>
      </DialogHeader>

      <div className="border-b border-gray-200 my-4"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FaIdCard className="mr-3 text-blue-600 text-xl" />
            <h3 className="text-lg font-semibold">Personal Information</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Customer Name</span>
              <span className="font-medium">{selectedCustomer.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">PAN</span>
              <span className="font-medium">{selectedCustomer.pan || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">GSTIN</span>
              <span className="font-medium">{selectedCustomer.gstin || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Contact Details Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FaPhone className="mr-3 text-blue-600 text-xl" />
            <h3 className="text-lg font-semibold">Contact Information</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Contact Number</span>
              <span className="font-medium">{selectedCustomer.contact_no}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">UPI ID</span>
              <span className="font-medium">{selectedCustomer.upi_id || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Address Details Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FaAddressCard className="mr-3 text-blue-600 text-xl" />
            <h3 className="text-lg font-semibold">Address Information</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Full Address</span>
              <span className="font-medium">{selectedCustomer.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">City</span>
              <span className="font-medium">{selectedCustomer.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">State</span>
              <span className="font-medium">{selectedCustomer.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pincode</span>
              <span className="font-medium">{selectedCustomer.pincode}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)}

      <Dialog
        open={isUpdateModalOpen}
        onOpenChange={() => {
          setIsUpdateModalOpen(false);
          setSelectedCustomer(null);
        }}
      >
        <DialogContent className="sm:max-w-[1000px]">
          <DialogHeader>
            <DialogTitle className="text-blue-700 flex items-center">
              <FaUser className="mr-3 text-blue-600" />
              Update Customer
            </DialogTitle>
          </DialogHeader>
          <Form>
            <div className="grid grid-cols-3 gap-5 justify-between">
              {(Object.keys(updateFormFields) as CustomerUpdateFieldKey[])
                .map((key) => (
                  <div key={key} className="flex flex-col gap-2">
                    <Label htmlFor={key}>
                      {key
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, l => l.toUpperCase())
                      }
                    </Label>
                    <Input
                      id={key}
                      value={updateFormFields[key] ?? ''}
                      onChange={(e) => handleUpdateInputChange(key, e)}
                      placeholder={`Enter ${key.replace(/_/g, ' ').toLowerCase()}`}
                      required={key !== 'upi_id' && key !== 'pan' && key !== 'gstin'} // Update this line
                    />
                  </div>
                ))}
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
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Update Customer
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the customer "{customerToDelete?.customer_name}"?
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
            
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CustomerTable;