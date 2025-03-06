import React, { useState } from 'react';
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
import { useToast } from '~/components/ui/toast';

interface PurchaseModalProps {
  onPurchaseCreated: () => void; // Callback function to refresh the table
}


const PurchaseModal: React.FC<PurchaseModalProps> = ({ onPurchaseCreated }) => {
  const { toast } = useToast();
  const [purchase, setPurchase] = useState({
    // Existing fields
    purity: '',
    description: '',
    pieces: '',
    net_weight: '',
    gross_weight: '',
    gold_rate: '',
    total_amount: '',
    
    // New customer fields
    customer_name: '',
    customer_contact: '',
    customer_address: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPurchase(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Calculation function
  const calculateTotalAmount = () => {
    const purity = parseFloat(purchase.purity);
    const netWeight = parseFloat(purchase.net_weight);
    const goldRate = parseFloat(purchase.gold_rate);

    if (!isNaN(purity) && !isNaN(netWeight) && !isNaN(goldRate)) {
      // Calculation: purity * net_weight * rate / 100
      const totalAmount = (purity * netWeight * goldRate) / 100;
      setPurchase(prev => ({
        ...prev,
        total_amount: totalAmount.toFixed(2) // Note: changed to match state key
      }));
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!purchase.purity || !purchase.net_weight || !purchase.gold_rate || 
        !purchase.pieces || !purchase.customer_name || !purchase.customer_contact) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    const purchaseData = {
      // Existing fields
      purity: parseFloat(purchase.purity),
      description: purchase.description || null,
      pieces: parseInt(purchase.pieces, 10),
      net_weight: parseFloat(purchase.net_weight),
      gross_weight: parseFloat(purchase.gross_weight),
      gold_rate: parseFloat(purchase.gold_rate),
      total_amount: parseFloat(purchase.total_amount),
      
      // New customer fields
      customer_name: purchase.customer_name,
      customer_contact: purchase.customer_contact,
      customer_address: purchase.customer_address || null,
      
      created_at: new Date().toISOString(), 
      product_code: '' 
    };

    // const newPurchaseId = await invoke('create_purchase', { purchase: purchaseData });

    onPurchaseCreated();
    
    toast({
      title: 'Purchase Created',
    //   description: `Purchase ID: ${newPurchaseId}`,
      variant: 'success'
    });

    // Reset form with all fields
    setPurchase({
      purity: '',
      description: '',
      pieces: '',
      net_weight: '',
      gross_weight: '',
      gold_rate: '',
      total_amount: '',
      customer_name: '',
      customer_contact: '',
      customer_address: ''
    });
  } catch (error) {
    console.log("Error", error);
    toast({
      title: 'Failed to Create Purchase',
      description: error instanceof Error ? error.message : String(error),
      variant: 'destructive'
    });
  }
};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Create Purchase</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="text-blue-700">Purchase</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-5 justify-between">

        <div className="flex flex-col gap-2 items-start justify-between">
            <Label htmlFor="customer_name" className="text-right">
              Customer Name
            </Label>
            <Input
              id="customer_name"
              value={purchase.customer_name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          
          {/* Customer Contact */}
          <div className="flex flex-col gap-2 items-start justify-between">
            <Label htmlFor="customer_contact" className="text-right">
              Customer Contact
            </Label>
            <Input
              id="customer_contact"
              type="tel"
              value={purchase.customer_contact}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          
          {/* Customer Address */}
          <div className="flex flex-col gap-2 items-start justify-between col-span-2">
            <Label htmlFor="customer_address" className="text-right">
              Customer Address
            </Label>
            <Input
              id="customer_address"
              value={purchase.customer_address}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          {/* Purity */}
          <div className="flex flex-col gap-2 items-start justify-between">
            <Label htmlFor="purity" className="text-right">
              Purity (%)
            </Label>
            <Input
              id="purity"
              type="number"
              value={purchase.purity}
              onChange={handleInputChange}
              onBlur={calculateTotalAmount}
              className="col-span-3"
            />
          </div>
          
          {/* Description */}
          <div className="flex flex-col gap-2 items-start justify-between">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={purchase.description}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          
          {/* Pieces */}
          <div className="flex flex-col gap-2 items-start justify-between">
            <Label htmlFor="pieces" className="text-right">
              Pieces
            </Label>
            <Input
              id="pieces"
              type="number"
              value={purchase.pieces}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          
          {/* Net Weight */}
          <div className="flex flex-col gap-2 items-start justify-between">
            <Label htmlFor="net_weight" className="text-right">
              Net Weight (gm)
            </Label>
            <Input
              id="net_weight"
              type="number"
              value={purchase.net_weight}
              onChange={handleInputChange}
              onBlur={calculateTotalAmount}
              className="col-span-3"
            />
          </div>
          
          {/* Gross Weight */}
          <div className="flex flex-col gap-2 items-start justify-between">
            <Label htmlFor="gross_weight" className="text-right">
              Gross Weight (gm)
            </Label>
            <Input
              id="gross_weight"
              type="number"
              value={purchase.gross_weight}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          
          {/* Gold Rate */}
          <div className="flex flex-col gap-2 items-start justify-between">
            <Label htmlFor="gold_rate" className="text-right">
              Gold Rate
            </Label>
            <Input
              id="gold_rate"
              type="number"
              value={purchase.gold_rate}
              onChange={handleInputChange}
              onBlur={calculateTotalAmount}
              className="col-span-3"
            />
          </div>
          
          {/* Total Amount */}
          <div className="flex flex-col gap-2 items-start justify-between">
            <Label htmlFor="total_amount" className="text-right">
              Total Amount
            </Label>
            <Input
              id="total_amount"
              type="number"
              value={purchase.total_amount}
              readOnly
              className="col-span-3 bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            className="bg-blue-600" 
            type="submit"
            onClick={handleSave}
            disabled={!purchase.total_amount}
          >
            Save Purchase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;