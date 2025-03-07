import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Form } from "@remix-run/react";

// Updated type definition to include GSTIN

const AddCustomerModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span>Add Customer</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="text-blue-700">Add Customer</DialogTitle>
        </DialogHeader>
        <Form method="post" action="./customer">
          <div className="grid grid-cols-3 gap-5 justify-between">
              {/* Form Type */}
              <div className="hidden flex-col gap-2 items-start justify-between">
              <Label htmlFor="form_type" className="text-right">
                Form Type
              </Label>
              <Input
                name="form_type"
                className="col-span-3"
                defaultValue="add-form"
              />
            </div>
            {/* Customer Name */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="name" className="text-right">
                Customer Name
              </Label>
              <Input
                name="name"
                className="col-span-3"
                // defaultValue={companyInfo?.companyInfo?.pan_no}
              />
            </div>
            {/* Customer Address */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                name="address"
                className="col-span-3"
                // defaultValue={companyInfo?.companyInfo?.pan_no}
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
                // defaultValue={companyInfo?.companyInfo?.pan_no}
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
                // defaultValue={companyInfo?.companyInfo?.pan_no}
              />
            </div>
            {/* City */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="city" className="text-right">
                City
              </Label>
              <Input
                name="city"
                className="col-span-3"
                // defaultValue={companyInfo?.companyInfo?.pan_no}
              />
            </div>
            {/* Contact No */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="contact_no" className="text-right">
                Contact No
              </Label>
              <Input
                name="contact_no"
                className="col-span-3"
                // defaultValue={companyInfo?.companyInfo?.pan_no}
              />
            </div>
            {/* Pincode */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="pincode" className="text-right">
                Pincode
              </Label>
              <Input
                name="pincode"
                className="col-span-3"
                // defaultValue={companyInfo?.companyInfo?.pan_no}
              />
            </div>
            {/* GSTIN */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="gstin_no" className="text-right">
                GSTIN No
              </Label>
              <Input
                name="gstin_no"
                className="col-span-3"
                // defaultValue={companyInfo?.companyInfo?.pan_no}
              />
            </div>
            {/* UPI Id */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="upi_id" className="text-right">
                UPI Id
              </Label>
              <Input
                name="upi_id"
                className="col-span-3"
                // defaultValue={companyInfo?.companyInfo?.pan_no}
              />
            </div>
            {/* PAN No */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="pan_no" className="text-right">
                PAN No
              </Label>
              <Input
                name="pan_no"
                className="col-span-3"
                // defaultValue={companyInfo?.companyInfo?.pan_no}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                onClick={() => {
                  setIsOpen(false);
                }}
                type="button"
                variant="outline"
                className="mr-2"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={() => {
                setIsOpen(false);
              }}
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Customer
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerModal;
