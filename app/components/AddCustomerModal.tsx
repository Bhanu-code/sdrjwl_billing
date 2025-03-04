import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";


// Updated type definition to include GSTIN
type CustomerFormFields = {
  customer_name: string;
  address: string;
  city: string;
  state: string;
  contact_no: string;
  pincode: string;
  pan: string;
  upi_id: string;
  gstin: string;  // New field
  id?: number;
  created_at?: string;
};

interface AddCustomerModalProps {
  onCustomerAdded: () => void; // Callback function to refresh the table
}


const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ onCustomerAdded }) => {
  // Updated initial state with GSTIN
  const initialState: CustomerFormFields = {
    customer_name: '',
    address: '',
    city: '',
    state: '',
    contact_no: '',
    pincode: '',
    pan: '',
    upi_id: '',
    gstin: ''  // New field initialization
  };

  const [formFields, setFormFields] = useState<CustomerFormFields>(initialState);
  const [isOpen, setIsOpen] = useState(false);


  const handleInputChange = (
    field: keyof CustomerFormFields, 
    value: string
  ) => {
    setFormFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Enhanced validation to include GSTIN check
  const validateForm = (): boolean => {
    if (!formFields.customer_name.trim()) {
     
      return false;
    }
    if (!formFields.contact_no.trim() || !/^\d{10}$/.test(formFields.contact_no)) {
     
      return false;
    }
    // GSTIN validation (15 characters, alphanumeric)
    if (formFields.gstin && !/^[0-9A-Z]{15}$/.test(formFields.gstin)) {
    
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const customerEntry = {
        ...formFields,
        id: undefined,
        created_at: undefined
      };

    
     

     
      setFormFields(initialState);
      setIsOpen(false);

      // Call the callback function to refresh the table
      onCustomerAdded();
    } catch (error) {
      console.error('❌ Failed to create Customer:', error);
     
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span>Add Customer</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="text-blue-700">Add Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-5 justify-between">
            {Object.keys(initialState)
              .filter(key => key !== 'id' && key !== 'created_at')
              .map((key) => (
                <div key={key} className="flex flex-col gap-2">
                  <Label htmlFor={key}>
                    {key === 'gstin' ? 'GSTIN' : 
                      key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                    }
                  </Label>
                  <Input
                    id={key}
                    value={formFields[key as keyof CustomerFormFields]}
                    onChange={(e) => handleInputChange(key as keyof CustomerFormFields, e.target.value)}
                    placeholder={`Enter ${key === 'gstin' ? 'GSTIN' : key.replace(/_/g, ' ').toLowerCase()}`}
                    required={key === 'customer_name' || key === 'contact_no'}
                  />
                </div>
              ))}
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="mr-2"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Customer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerModal;