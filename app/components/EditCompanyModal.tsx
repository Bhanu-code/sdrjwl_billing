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

const EditCompanyModal = (companyInfo: any) => {

    // console.log("Comapny Info", companyInfo)
  
  
  const [isOpen, setIsOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span>Edit Details</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="text-blue-700">Add Company Information</DialogTitle>
        </DialogHeader>
        <Form method='post'>
          <div className="grid grid-cols-2 gap-5 justify-between">
            {/* Form Type */}
          <div className="hidden  flex-col gap-2 items-start justify-between">
              <Label htmlFor="form_type" className="text-right">
                Form Type
              </Label>
              <Input
                name="form_type"
                className="col-span-3"
                defaultValue="edit-form"
                required
              />
            </div>
            {/* Company Name */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="company_name" className="text-right">
                Company Name
              </Label>
              <Input
                name="company_name"
                className="col-span-3"
                defaultValue={companyInfo?.companyInfo?.company_name}
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
                {/* <span className="text-sm text-gray-600">
                  {formFields.logo_path && formFields.logo_path.split('/').pop()}
                </span> */}
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
                defaultValue={companyInfo?.companyInfo?.city}
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
                defaultValue={companyInfo?.companyInfo?.district}
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
                defaultValue={companyInfo?.companyInfo?.state}
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
                defaultValue={companyInfo?.companyInfo?.contact_no}
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
                defaultValue={companyInfo?.companyInfo?.gstin_no}
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
                defaultValue={companyInfo?.companyInfo?.upi_id}
              />
            </div><div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="bis_reg_no" className="text-right">
                BIS REG. No
              </Label>
              <Input
                name="bis_reg_no"
                className="col-span-3"
                defaultValue={companyInfo?.companyInfo?.bis_reg_no}
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
                defaultValue={companyInfo?.companyInfo?.pan_no}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button 
              type="submit" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={()=>{
                setIsOpen(false)
              }}
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

export default EditCompanyModal;