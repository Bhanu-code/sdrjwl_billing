import React, { useState, useEffect } from 'react';

import { Button } from "./ui/button";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Form } from '@remix-run/react';

type CompanyFormFields = {
  id?: number;
  company_name: string;
  address: string;
  state: string;
  contact_no: string;
  gstin_no?: string | null;
  upi_id?: string | null;
  logo_path?: string | null;
  created_at?: string;
  // New fields
  bis_reg_no?: string | null;
  pan?: string | null;
};

interface ExtendedFile extends File {
  path?: string;
}

const AddCompanyModal: React.FC = () => {
  // Initial state for form fields
  const initialState: CompanyFormFields = {
    company_name: '',
    address: '',
    state: '',
    contact_no: '',
    gstin_no: null,
    upi_id: null,
    logo_path: null,
    bis_reg_no: null,  // New field
    pan: null,         // New field
  };
  // State management
  const [formFields, setFormFields] = useState<CompanyFormFields>(initialState);
  
  const [isOpen, setIsOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Fetch the single company entry on component mount
  

  // Generic handler for input changes
  const handleInputChange = (
    field: keyof CompanyFormFields, 
    value: string
  ) => {
    setFormFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

 





  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span>Company Registration</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="text-blue-700">Add Company Information</DialogTitle>
        </DialogHeader>
        <Form >
          <div className="grid grid-cols-2 gap-5 justify-between">
            {/* Company Name */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="company_name" className="text-right">
                Company Name
              </Label>
              <Input
                id="company_name"
                value={formFields.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            {/* Company Logo */}
            <div className="flex flex-col gap-2">
            <Label htmlFor="company_logo">Company Logo</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                id="company_logo"
                // onChange={handleFileUpload}
                accept="image/*"
                className="flex-grow"
              />
              {logoPreview && (
                <Button 
                  type="button" 
                  variant="destructive" 
                //   onClick={handleRemoveLogo}
                  className="ml-2"
                >
                  Remove
                </Button>
              )}
            </div>
            {logoPreview && (
              <div className="mt-2 flex items-center">
                <img 
                  src={logoPreview} 
                  alt="Company Logo" 
                  className="max-w-[100px] max-h-[100px] object-contain mr-4"
                />
                <span className="text-sm text-gray-600">
                  {formFields.logo_path && formFields.logo_path.split('/').pop()}
                </span>
              </div>
            )}
          </div>


            {/* Address */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                value={formFields.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            {/* State */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="state" className="text-right">
                State
              </Label>
              <Input
                id="state"
                value={formFields.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            {/* Contact No */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="contact_no" className="text-right">
                Contact No.
              </Label>
              <Input
                id="contact_no"
                value={formFields.contact_no}
                onChange={(e) => handleInputChange('contact_no', e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            {/* GSTIN No */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="gstin_no" className="text-right">
                GSTIN No.
              </Label>
              <Input
                id="gstin_no"
                value={formFields.gstin_no || ''}
                onChange={(e) => handleInputChange('gstin_no', e.target.value)}
                className="col-span-3"
              />
            </div>

            {/* UPI ID */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="upi_id" className="text-right">
                UPI ID
              </Label>
              <Input
                id="upi_id"
                value={formFields.upi_id || ''}
                onChange={(e) => handleInputChange('upi_id', e.target.value)}
                className="col-span-3"
              />
            </div><div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="bis_reg_no" className="text-right">
                BIS REG. No
              </Label>
              <Input
                id="bis_reg_no"
                value={formFields.bis_reg_no || ''}
                onChange={(e) => handleInputChange('bis_reg_no', e.target.value)}
                className="col-span-3"
              />
            </div>

            {/* PAN */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="pan" className="text-right">
                PAN
              </Label>
              <Input
                id="pan"
                value={formFields.pan || ''}
                onChange={(e) => handleInputChange('pan', e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-700 text-white hover:bg-blue-800"
            >
              Save Company Information
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompanyModal;