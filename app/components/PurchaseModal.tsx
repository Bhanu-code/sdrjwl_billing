import React, { useEffect, useState } from "react";
// import { invoke } from '@tauri-apps/api/core';
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/toast";
import { Form } from "@remix-run/react";

const PurchaseModal = () => {
  const [purity, setPurity] = useState<any>(0.0);
  const [net_weight, setNetWeight] = useState<any>(0);
  const [gold_rate, setGoldRate] = useState<any>(0);
  const [total_amount, setTotalAmount] = useState<any>(0);

  // Calculation function
  const calculateTotalAmount = () => {
    const Purity = parseFloat(purity);
    const netWeight = parseFloat(net_weight);
    const goldRate = parseFloat(gold_rate);

    if (!isNaN(purity) && !isNaN(netWeight) && !isNaN(goldRate)) {
      // Calculation: purity * net_weight * rate / 100
      const totalAmount = (Purity * netWeight * goldRate) / 100;
      setTotalAmount(totalAmount.toFixed(2));
    }
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [purity, net_weight, gold_rate]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Create Purchase</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="text-blue-700">Purchase</DialogTitle>
        </DialogHeader>
        <Form method="post">
          <div className="grid grid-cols-4 gap-5 justify-between">
            <div className="flex flex-col gap-2 items-start justify-between">
              <Input
                className="hidden"
                name="form_type"
                defaultValue="create-form"
              />
              <Label htmlFor="customer_name" className="text-right">
                Customer Name
              </Label>
              <Input
                id="customer_name"
                name="customer_name"
                // value={purchase.customer_name}
                // onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Customer Contact */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="customer_contact" className="text-right">
                Customer Contact
              </Label>
              <Input
                name="customer_contact"
                // type="tel"
                // value={purchase.customer_contact}
                // onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Customer Address */}
            <div className="flex flex-col gap-2 items-start justify-between col-span-2">
              <Label htmlFor="customer_address" className="text-right">
                Customer Address
              </Label>
              <Input
                name="customer_address"
                // value={purchase.customer_address}
                // onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            {/* Purity */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="purity" className="text-right">
                Purity (%)
              </Label>
              <Input
                name="purity"
                type="number"
                // value={purchase.purity}
                onChange={(e: any) => {
                  setPurity(e.target.value);
                }}
                // onBlur={calculateTotalAmount}
                className="col-span-3"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                name="description"
                // value={purchase.description}
                // onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Pieces */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="pieces" className="text-right">
                Pieces
              </Label>
              <Input
                name="pieces"
                type="number"
                // value={purchase.pieces}
                // onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Net Weight */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="net_weight" className="text-right">
                Net Weight (gm)
              </Label>
              <Input
                name="net_weight"
                type="number"
                // value={purchase.net_weight}
                onChange={(e: any) => {
                  setNetWeight(e.target.value);
                }}
                // onBlur={calculateTotalAmount}
                className="col-span-3"
              />
            </div>

            {/* Gross Weight */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="gross_weight" className="text-right">
                Gross Weight (gm)
              </Label>
              <Input
                name="gross_weight"
                type="number"
                // value={purchase.gross_weight}
                // onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Gold Rate */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="gold_rate" className="text-right">
                Gold Rate
              </Label>
              <Input
                name="gold_rate"
                type="number"
                // value={purchase.gold_rate}
                onChange={(e: any) => {
                  setGoldRate(e.target.value);
                }}
                // onBlur={calculateTotalAmount}
                className="col-span-3"
              />
            </div>

            {/* Total Amount */}
            <div className="flex flex-col gap-2 items-start justify-between">
              <Label htmlFor="total_amount" className="text-right">
                Total Amount
              </Label>
              <Input
                name="total_amount"
                type="number"
                value={total_amount}
                readOnly
                className="col-span-3 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
          <br />
          <div className="flex flex-end w-full">
            <Button onClick={(e:any)=> close()} className="bg-blue-600 ml-auto" type="submit">
              Save Purchase
            </Button>
          </div>
        </Form>
        {/* <DialogFooter>
            <Button className="bg-blue-600" type="submit">
              Save Purchase
            </Button>
          </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
