import React, { useState } from 'react';
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
  city: string;
  district: string;
  state: string;
  contact_no: string;
  gstin_no?: string | null;
  upi_id?: string | null;
  logo_path?: string | null;
  created_at?: string;
  bis_reg_no?: string | null;
  pan_no?: string | null;
};

interface AddCompanyModalProps {
  companyInfo?: CompanyFormFields | null;
  onCustomerAdded?: () => void;
  // Add mode and buttonText properties like CompanyModal
  mode?: 'add' | 'edit';
  buttonText?: string;
}

const AddCompanyModal = ({ companyInfo, onCustomerAdded, mode = 'add', buttonText }: AddCompanyModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const isEdit = mode === 'edit';
  const formTitle = isEdit ? "Company Information" : "Add Company Information";
  const submitButtonText = isEdit ? "Save Company Information" : "Create Company";
  const displayButtonText = buttonText || (isEdit ? "Company Info" : "Add Company");

  // Function to handle logo upload and preview
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to remove logo preview
  const handleRemoveLogo = () => {
    setLogoPreview(null);
    // Reset the file input
    const fileInput = document.querySelector('input[name="company_logo"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span>{displayButtonText}</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="text-blue-700">{formTitle}</DialogTitle>
        </DialogHeader>
        <Form method="post" encType="multipart/form-data">
          <div className="grid grid-cols-2 gap-5 justify-between">
            {/* Hidden Form Type Field */}
            <input 
              type="hidden" 
              name="form_type" 
              value={isEdit ? "edit-form" : "add-form"} 
            />
            
            {/* Hidden ID Field for Edit Mode */}
            {isEdit && companyInfo?.id && (
              <input 
                type="hidden" 
                name="id" 
                value={companyInfo.id} 
              />
            )}
            
            {/* Company Name */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="company_name" className="text-right">
                Company Name
              </Label>
              <Input
                name="company_name"
                className="col-span-3"
                defaultValue={companyInfo?.company_name || ''}
                required
              />
            </div>

            {/* Company Logo */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="company_logo">Company Logo</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  name="company_logo"
                  accept="image/*"
                  className="flex-grow"
                  onChange={handleFileUpload}
                />
                {logoPreview && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={handleRemoveLogo}
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
                </div>
              )}
            </div>

            {/* City */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="city" className="text-right">
                City
              </Label>
              <Input
                name="city"
                className="col-span-3"
                defaultValue={companyInfo?.city || ''}
                required
              />
            </div>
            
            {/* District */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="district" className="text-right">
                District
              </Label>
              <Input
                name="district"
                className="col-span-3"
                defaultValue={companyInfo?.district || ''}
                required
              />
            </div>

            {/* State */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="state" className="text-right">
                State
              </Label>
              <Input
                name="state"
                className="col-span-3"
                defaultValue={companyInfo?.state || ''}
                required
              />
            </div>

            {/* Contact No */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="contact_no" className="text-right">
                Contact No.
              </Label>
              <Input
                name="contact_no"
                className="col-span-3"
                defaultValue={companyInfo?.contact_no || ''}
                required
              />
            </div>

            {/* GSTIN No */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="gstin_no" className="text-right">
                GSTIN No.
              </Label>
              <Input
                name="gstin_no"
                className="col-span-3"
                defaultValue={companyInfo?.gstin_no || ''}
              />
            </div>

            {/* UPI ID */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="upi_id" className="text-right">
                UPI ID
              </Label>
              <Input
                name="upi_id"
                className="col-span-3"
                defaultValue={companyInfo?.upi_id || ''}
              />
            </div>
            
            {/* BIS Registration No */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="bis_reg_no" className="text-right">
                BIS REG. No
              </Label>
              <Input
                name="bis_reg_no"
                className="col-span-3"
                defaultValue={companyInfo?.bis_reg_no || ''}
              />
            </div>

            {/* PAN */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="pan_no" className="text-right">
                PAN
              </Label>
              <Input
                name="pan_no"
                className="col-span-3"
                defaultValue={companyInfo?.pan_no || ''}
              />
            </div>
          </div>

          {/* Only show DialogFooter with buttons when NOT in edit mode */}
          {!isEdit && (
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
                onClick={() => {
                  setIsOpen(false);
                  if (onCustomerAdded) onCustomerAdded();
                }}
                className="bg-blue-700 text-white hover:bg-blue-800"
              >
                {submitButtonText}
              </Button>
            </DialogFooter>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompanyModal;