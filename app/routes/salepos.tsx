import React, { useState, useEffect } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { createSalesPOS, getSalesPOSData, deleteSalesPOS, getMasterEntryData } from "~/data/salesPOS.server";
import SalesPOSTable from "~/components/SalesPOSTable"; // Import the SalesPOSTable component
import { z } from "zod";
import { getCompanyInfo } from "~/data/company.server";

// Define a schema for validating the form data
const SalesPOSFormSchema = z.object({
  contact_number: z.string(),
  customer_id: z.string(),
  customer_name: z.string(),
  gstin_no: z.string(),
  product_code: z.string(),
  product_name: z.string(),
  live_rate: z.string().transform((val) => val !== "manual"), // Convert string to boolean
  gold_price: z.string().transform((val) => parseFloat(val) || 0), // Convert string to number
  manual_rate: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  unit: z.string(),
  gross_weight: z.string().transform((val) => parseFloat(val) || 0), // Ensure this is parsed as a number
  net_weight: z.string().transform((val) => parseFloat(val) || 0), // Convert string to number
  making_charges: z.string().transform((val) => parseFloat(val) || 0), // Convert string to number
  sales_total: z.string().transform((val) => parseFloat(val) || 0), // Convert string to number
  discount_percent: z.string().transform((val) => parseFloat(val) || 0), // Convert string to number
  total_rate: z.string().transform((val) => parseFloat(val) || 0), // Convert string to number
  gst_type: z.string(),
  total_amount: z.string().transform((val) => parseFloat(val) || 0), // Convert string to number
  barcode_number: z.string(),
  other_charges: z.string().transform((val) => parseFloat(val) || 0), // Convert string to number
  reference: z.string(),
  pay_mode: z.string(),
  cash_adjustment: z.string().transform((val) => parseFloat(val) || 0), // Convert string to number
  master_entry_rate: z.string().optional().transform((val) => val ? parseFloat(val) : undefined), // Convert string to number or undefined
  purity: z.string().optional(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const salesPOSData = await getSalesPOSData();
  const masterEntryData = await getMasterEntryData();
  const companyData = await getCompanyInfo();
  return json({ salesPOSData, masterEntryData, companyData });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "create": {
      try {
        // Parse and validate the form data
        const rawData = Object.fromEntries(formData);
        console.log("Raw form data:", rawData);
        const parsedData = SalesPOSFormSchema.parse(rawData);
        console.log("Parsed data:", parsedData);

        // Create the sales POS entry
        const createdPOS = await createSalesPOS(parsedData);
        return json({ createdPOS, success: true });
      } catch (error) {
        console.error("Error creating sales POS:", error);
        return json(
          {
            error: error instanceof Error ? error.message : "Failed to create sales POS entry",
            success: false
          },
          { status: 400 }
        );
      }
    }
    case "delete": {
      try {
        const id = formData.get("id");
        if (!id) {
          return json({ error: "ID is required", success: false }, { status: 400 });
        }
        await deleteSalesPOS(Number(id));
        return json({ success: true });
      } catch (error) {
        console.error("Error deleting sales POS:", error);
        return json({ error: error instanceof Error ? error.message : "Failed to delete sales POS entry", success: false }, { status: 400 });
      }
    }
    default:
      return json({ error: "Invalid intent", success: false }, { status: 400 });
  }
}

type ActionResponse = {
  success: boolean;
  createdPOS?: any; // Replace `any` with the actual type of `createdPOS`
  error?: string;
};

const SalesPOS = () => {
  const { salesPOSData, masterEntryData, companyData } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<ActionResponse>();
  const [isOpen, setIsOpen] = useState(false);
  const [grossWeight, setGrossWeight] = useState<number>(0);
  // State variables for form inputs
  const [contactNumber, setContactNumber] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("CUST-" + Date.now()); // Generate a default customer ID
  const [customerName, setCustomerName] = useState<string>("");
  const [gstNo, setGstNo] = useState<string>("");
  const [productCode, setProductCode] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [gstType, setGstType] = useState<string>("gst"); // Default to "gst"
  const [liveRate, setLiveRate] = useState<string>("gold_24c"); // Default to gold_24k
  const [manualRate, setManualRate] = useState<string>("");
  const [netWeight, setNetWeight] = useState<number>(0);
  const [makingCharges, setMakingCharges] = useState<number>(0);
  const [unit, setUnit] = useState<string>("weight"); // Default to "weight"
  const [salesTotal, setSalesTotal] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [totalRate, setTotalRate] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [percentageValue, setPercentageValue] = useState<number>(0);
  const [otherCharges, setOtherCharges] = useState<number>(0);
  const [reference, setReference] = useState<string>("");
  const [payMode, setPayMode] = useState<string>("cash"); // Default to "cash"
  const [cashAdjustment, setCashAdjustment] = useState<number>(0);
  const [barcodeNumber, setBarcodeNumber] = useState<string>("");
  const [selectedLiveRatePrice, setSelectedLiveRatePrice] = useState<number>(6000); // Default rate
  const [baseCalculation, setBaseCalculation] = useState<string>("");
  const [goldPrice, setGoldPrice] = useState<number>(6000); // Default gold price
  const [purity, setPurity] = useState<string>(""); // Add this line

  // Set default live rate prices - in a real app, these would come from an API or database
  const liveRatePrices = masterEntryData[0] || {
    gold_16c: 4000,
    gold_18c: 4500,
    gold_22c: 5500,
    gold_24c: 6000,
    silver_pure: 800,
    silver_ornamental: 900,
    manual: 0 // This will be overridden by manual input
  };

  // Update selected live rate price when live rate option changes
  useEffect(() => {
    if (liveRate !== "manual") {
      const price = liveRatePrices[liveRate] || 0;
      setSelectedLiveRatePrice(price);
      setGoldPrice(price);
    } else if (manualRate) {
      const parsedRate = parseFloat(manualRate);
      setSelectedLiveRatePrice(parsedRate);
      setGoldPrice(parsedRate);
    }
  }, [liveRate, manualRate, liveRatePrices]);

  // Calculate sales total
  const calculateSalesTotal = () => {
    let total = 0;
    let baseAmount = 0;
    let price: number;

    if (liveRate !== "manual" && selectedLiveRatePrice > 0) {
      price = selectedLiveRatePrice;
    } else if (liveRate === "manual" && manualRate) {
      price = parseFloat(manualRate);
    } else {
      setSalesTotal(0);
      setBaseCalculation("");
      return;
    }

    switch (unit) {
      case "percentage":
        baseAmount = price * netWeight;
        const percentageAmount = (baseAmount * percentageValue) / 100;
        total = baseAmount + percentageAmount;
        setBaseCalculation(`Base (${price} × ${netWeight}) = ${baseAmount.toFixed(2)} + Percentage (${percentageValue}%) = ${percentageAmount.toFixed(2)}`);
        break;
      case "weight":
        total = netWeight * price;
        if (makingCharges > 0) {
          total += makingCharges * netWeight;
        }
        setBaseCalculation("");
        break;
      case "piece":
        total = netWeight * goldPrice + makingCharges;
        setBaseCalculation("");
        break;
        break;
      default:
        total = 0;
        setBaseCalculation("");
    }

    const roundedTotal = parseFloat(total.toFixed(2));
    setSalesTotal(roundedTotal);
  };

  // Calculate total rate
  const calculateTotalRate = () => {
    // Calculate taxable value (before GST)
    const taxableValue = salesTotal * (1 - discountPercent / 100);

    // Calculate GST amount
    const gstAmt = calculateGSTAmount(taxableValue);

    // Calculate total rate (taxable value + GST)
    const totalWithGST = taxableValue + gstAmt;

    // Set the total rate
    setTotalRate(totalWithGST);
  };

  // Calculate GST amount
  const calculateGSTAmount = (baseAmount: number) => {
    let gstRate = 0;
    if (gstType === "gst" || gstType === "igst") {
      gstRate = 0.03; // 3% GST
    }
    return baseAmount * gstRate;
  };

  // Calculate total amount
  const calculateTotalAmount = () => {
    let baseRate = totalRate + otherCharges; // Add other charges to the total rate
    const finalAmount = baseRate - cashAdjustment; // Subtract cash adjustment
    setTotalAmount(finalAmount);
  };

  // Recalculate whenever dependencies change
  useEffect(() => {
    calculateSalesTotal();
  }, [liveRate, manualRate, netWeight, makingCharges, unit, percentageValue, selectedLiveRatePrice]);

  useEffect(() => {
    calculateTotalRate();
  }, [salesTotal, discountPercent, gstType]);

  useEffect(() => {
    calculateTotalAmount();
  }, [totalRate, otherCharges, gstType, cashAdjustment]);

  const handlePOSCreated = () => {
    // Only close the dialog if the submission was successful
    if (fetcher.state === "idle" && fetcher.data?.success) {
      setIsOpen(false);
      // Reset form values for next entry
      setContactNumber("");
      setGrossWeight(0);
      setCustomerId("CUST-" + Date.now());
      setCustomerName("");
      setGstNo("");
      setProductCode("");
      setProductName("");
      setBarcodeNumber("");
      setNetWeight(0);
      setMakingCharges(0);
      setDiscountPercent(0);
      setOtherCharges(0);
      setReference("");
      setCashAdjustment(0);
      setPurity("");
    }
  };

  // Monitor fetcher state for form submission results
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        console.log("POS created successfully:", fetcher.data.createdPOS);
        handlePOSCreated();
      } else if (fetcher.data.error) {
        console.error("Error creating POS:", fetcher.data.error);
        // Here you could display an error message to the user
      }
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <div className="m-4">
      <div className="actions">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant={"outline"}>Create POS</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[1000px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-blue-700">Create POS</DialogTitle>
            </DialogHeader>
            <fetcher.Form method="POST">
              <div className="grid grid-cols-4 gap-5 justify-between">
                {/* Customer Information Section */}
                <div className="col-span-4">
                  <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Hidden Customer ID */}
                    <input type="hidden" name="customer_id" value={customerId} />

                    {/* Contact Number */}
                    <div className="flex flex-col gap-1 items-start justify-between">
                      <Label htmlFor="contact_no" className="text-right text-sm">
                        Contact Number
                      </Label>
                      <Input
                        id="contact_no"
                        name="contact_number"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="Contact number"
                        className="col-span-3"
                      />
                    </div>

                    {/* Customer Name */}
                    <div className="flex flex-col gap-1 items-start justify-between">
                      <Label htmlFor="customer_name" className="text-right text-sm">
                        Customer Name
                      </Label>
                      <Input
                        id="customer_name"
                        name="customer_name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter customer name"
                        className="col-span-3"
                      />
                    </div>

                    {/* GSTIN No */}
                    <div className="flex flex-col gap-1 items-start justify-between">
                      <Label htmlFor="gstin_no" className="text-right text-sm">
                        GSTIN No
                      </Label>
                      <Input
                        id="gstin_no"
                        name="gstin_no"
                        value={gstNo}
                        onChange={(e) => setGstNo(e.target.value)}
                        placeholder="Enter GSTIN number"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Information Section */}
                <div className="col-span-4">
                  <h3 className="text-lg font-semibold mb-3">Product Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Product Code */}
                    <div className="flex flex-col gap-1 items-start justify-between">
                      <Label htmlFor="product_code" className="text-right text-sm">
                        Product Code
                      </Label>
                      <Input
                        id="product_code"
                        name="product_code"
                        value={productCode}
                        onChange={(e) => setProductCode(e.target.value)}
                        placeholder="Enter product code"
                        className="col-span-3"
                      />
                    </div>

                    {/* Product Name */}
                    <div className="flex flex-col gap-1 items-start justify-between">
                      <Label htmlFor="product_name" className="text-right text-sm">
                        Product Name
                      </Label>
                      <Input
                        id="product_name"
                        name="product_name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Enter product name"
                        className="col-span-3"
                      />
                    </div>

                    {/* Barcode Number */}
                    <div className="flex flex-col gap-1 items-start justify-between">
                      <Label htmlFor="barcode_number" className="text-right text-sm">
                        Barcode Number
                      </Label>
                      <Input
                        id="barcode_number"
                        name="barcode_number"
                        value={barcodeNumber}
                        onChange={(e) => setBarcodeNumber(e.target.value)}
                        placeholder="Enter barcode or product code"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing and Charges Section */}
                <div className="col-span-4">
                  <h3 className="text-lg font-semibold mb-3">Pricing and Charges</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Hidden gold_price field - this is critical! */}
                    <input type="hidden" name="gold_price" value={goldPrice} />

                    {/* Live Rate Selection */}
                    <div className="flex flex-col gap-1 items-start justify-between">
                      <Label htmlFor="live_rate" className="text-right text-sm">
                        Live Rate
                      </Label>
                      <select
                        id="live_rate"
                        name="live_rate"
                        value={liveRate}
                        onChange={(e) => setLiveRate(e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="gold_24c">Gold 24K (₹{liveRatePrices.gold_24c}/g)</option>
                        <option value="gold_22c">Gold 22K (₹{liveRatePrices.gold_22c}/g)</option>
                        <option value="gold_18c">Gold 18K (₹{liveRatePrices.gold_18c}/g)</option>
                        <option value="gold_16c">Gold 16K (₹{liveRatePrices.gold_16c}/g)</option>
                        <option value="silver_pure">Silver Pure (₹{liveRatePrices.silver_pure}/g)</option>
                        <option value="silver_ornamental">Silver Ornamental (₹{liveRatePrices.silver_ornamental}/g)</option>
                        <option value="manual">Manual Entry</option>
                      </select>
                    </div>

                    {/* Manual Rate */}
                    {liveRate === "manual" && (
                      <div className="flex flex-col gap-1 items-start justify-between">
                        <Label htmlFor="manual_rate" className="text-right text-sm">
                          Manual Gold Rate
                        </Label>
                        <Input
                          id="manual_rate"
                          name="manual_rate"
                          type="number"
                          value={manualRate}
                          onChange={(e) => setManualRate(e.target.value)}
                          placeholder="Enter gold rate"
                          className="col-span-3"
                        />
                      </div>
                    )}

                    {/* Unit Selection */}
                    <div className="flex flex-col gap-1 items-start justify-between">
                      <Label htmlFor="unit" className="text-right text-sm">
                        Unit
                      </Label>
                      <select
                        id="unit"
                        name="unit"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="weight">Weight(W)</option>
                        <option value="piece">Piece(P)</option>
                        <option value="percentage">Percentage(%)</option>
                      </select>
                    </div>

                    {unit === 'percentage' && (
                      <div className="flex flex-col gap-1 items-start justify-between">
                        <Label htmlFor="percentage_value" className="text-right text-sm">
                          Percentage Value
                        </Label>
                        <Input
                          id="percentage_value"
                          name="percentage_value"
                          type="number"
                          value={percentageValue}
                          onChange={(e) => setPercentageValue(parseFloat(e.target.value) || 0)}
                          placeholder="Enter percentage"
                          className="col-span-3"
                        />
                      </div>
                    )}

                    {/* Base Calculation Display (only shown when unit is 'percentage' and there's a base calculation) */}
                    {unit === 'percentage' && baseCalculation && (
                      <div className="flex flex-col gap-1 items-start justify-between col-span-2">
                        <Label className="text-right text-sm">
                          Base Calculation
                        </Label>
                        <Input
                          value={baseCalculation}
                          disabled
                          className="col-span-3"
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-1 items-start justify-between">
                      <Label htmlFor="gross_weight" className="text-right text-sm">
                        Gross Weight
                      </Label>
                      <Input
                        id="gross_weight"
                        name="gross_weight"
                        type="number"
                        value={grossWeight}
                        onChange={(e) => setGrossWeight(parseFloat(e.target.value) || 0)}
                        placeholder="gross weight"
                        className="col-span-3"
                      />
                    </div>

                    {/* Net Weight */}
                    <div className="flex flex-col gap-1 items-start justify-between">
                      <Label htmlFor="net_weight" className="text-right text-sm">
                        Net Weight
                      </Label>
                      <Input
                        id="net_weight"
                        name="net_weight"
                        type="number"
                        value={netWeight}
                        onChange={(e) => setNetWeight(parseFloat(e.target.value) || 0)}
                        placeholder="net weight"
                        className="col-span-3"
                      />
                    </div>

                    {/* Making Charges */}
                    <div className="flex flex-col gap-1 items-start justify-between">
                      <Label htmlFor="making_charges" className="text-right text-sm">
                        Making Charges
                      </Label>
                      <Input
                        id="making_charges"
                        name="making_charges"
                        type="number"
                        value={makingCharges}
                        onChange={(e) => setMakingCharges(parseFloat(e.target.value) || 0)}
                        placeholder="making charges"
                        className="col-span-3"
                      />
                    </div>

                    {/* Sales Total */}
                    <div className="flex flex-col gap-1 items-start justify-between">
                      <Label htmlFor="sales_total" className="text-right text-sm">
                        Sales Total
                      </Label>
                      <Input
                        id="sales_total"
                        name="sales_total"
                        value={salesTotal.toFixed(2)}
                        placeholder="Calculated Total"
                        className="col-span-3"
                        readOnly
                      />
                    </div>

                    {/* GST Type */}
                    <div className="flex flex-col gap-1 items-start justify-between">
                      <Label htmlFor="gst_type" className="text-right text-sm">
                        Select GST Type
                      </Label>
                      <select
                        id="gst_type"
                        name="gst_type"
                        value={gstType}
                        onChange={(e) => setGstType(e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="gst">GST</option>
                        <option value="igst">IGST</option>
                      </select>
                    </div>

                    {/* GST Fields */}
                    {gstType === "gst" && (
                      <>
                        <div className="flex flex-col gap-1 items-start justify-between">
                          <Label htmlFor="cgst_percent" className="text-right text-sm">
                            CGST % (1.5%)
                          </Label>
                          <Input
                            id="cgst_percent"
                            name="cgst_percent"
                            value="1.5"
                            disabled
                            className="col-span-3"
                          />
                        </div>
                        <div className="flex flex-col gap-1 items-start justify-between">
                          <Label
                            htmlFor="sgst_utgst_percent"
                            className="text-right text-sm"
                          >
                            SGST/UTGST % (1.5%)
                          </Label>
                          <Input
                            id="sgst_utgst_percent"
                            name="sgst_utgst_percent"
                            value="1.5"
                            disabled
                            className="col-span-3"
                          />
                        </div>
                      </>
                    )}

                    {/* IGST Field */}
                    {gstType === "igst" && (
                      <div className="flex flex-col gap-1 items-start justify-between">
                        <Label htmlFor="igst_percent" className="text-right text-sm">
                          IGST % (3%)
                        </Label>
                        <Input
                          id="igst_percent"
                          name="igst_percent"
                          value="3"
                          disabled
                          className="col-span-3"
                        />
                      </div>
                    )}

                    {/* Discount % */}
                    <div className="flex flex-col gap-1 items-start justify-between">
                      <Label htmlFor="discount" className="text-right text-sm">
                        Discount %
                      </Label>
                      <Input
                        id="discount"
                        name="discount_percent"
                        type="number"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                        placeholder="discount percentage"
                        className="col-span-3"
                      />
                    </div>

                    {/* Total Rate */}
                    <div className="flex flex-col gap-1 items-start justify-between">
                      <Label htmlFor="total_rate" className="text-right text-sm">
                        Total Rate
                      </Label>
                      <Input
                        id="total_rate"
                        name="total_rate"
                        value={totalRate.toFixed(2)}
                        placeholder="calculated total rate"
                        className="col-span-3"
                        readOnly
                      />
                    </div>

                    <div className="flex flex-col gap-1 items-start justify-between">
                      <Label htmlFor="purity" className="text-right text-sm">
                        Purity
                      </Label>
                      <Input
                        id="purity"
                        name="purity"
                        value={purity}
                        onChange={(e) => setPurity(e.target.value)}
                        placeholder="Enter purity"
                        className="col-span-3"
                      />
                    </div>

                    {/* Other Charges */}
                    <div className="flex flex-col gap-1 items-start justify-between">
                      <Label htmlFor="other_charges" className="text-right text-sm">
                        Other Charges
                      </Label>
                      <Input
                        id="other_charges"
                        name="other_charges"
                        type="number"
                        value={otherCharges}
                        onChange={(e) => setOtherCharges(parseFloat(e.target.value) || 0)}
                        placeholder="Enter other charges"
                        className="col-span-3"
                      />
                    </div>

                    {/* Reference */}
                    <div className="flex flex-col gap-1 items-start justify-between col-span-2">
                      <Label htmlFor="reference" className="text-right text-sm">
                        Reference
                      </Label>
                      <Input
                        id="reference"
                        name="reference"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Enter reference details"
                        className="col-span-3"
                      />
                    </div>

                    {/* Pay Mode */}
                    <div className="flex flex-col gap-1 items-start justify-between ">
                      <Label htmlFor="pay_mode" className="text-right text-sm">
                        Payment Mode
                      </Label>
                      <select
                        id="pay_mode"
                        name="pay_mode"
                        value={payMode}
                        onChange={(e) => setPayMode(e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="cash">Cash</option>
                        <option value="net_banking">Net Banking</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="debit_card">Debit Card</option>
                        <option value="upi">UPI</option>
                      </select>
                    </div>

                    {/* Cash Adjustment */}
                    <div className="flex flex-col gap-1 items-start justify-between">
                      <Label htmlFor="cash_adjustment" className="text-right text-sm">
                        Cash Adjustment
                      </Label>
                      <Input
                        id="cash_adjustment"
                        name="cash_adjustment"
                        type="number"
                        value={cashAdjustment}
                        onChange={(e) => setCashAdjustment(parseFloat(e.target.value) || 0)}
                        placeholder="Enter cash adjustment"
                        className="col-span-3"
                      />
                    </div>

                    {/* Total Amount */}
                    <div className="flex flex-col gap-1 items-start justify-between">
                      <Label htmlFor="total_amt" className="text-right text-sm">
                        Total Amount
                      </Label>
                      <Input
                        id="total_amt"
                        name="total_amount"
                        value={totalAmount.toFixed(2)}
                        placeholder="total amount"
                        className="col-span-3"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                {fetcher.state === "submitting" ? (
                  <Button disabled className="bg-blue-600">
                    Creating...
                  </Button>
                ) : (
                  <Button
                    className="bg-blue-600"
                    type="submit"
                    name="intent"
                    value="create"
                  >
                    Create
                  </Button>
                )}
              </DialogFooter>
            </fetcher.Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="data-table overflow-auto max-h-[calc(100vh-200px)] mt-10"> {/* Add this wrapper */}
        <SalesPOSTable data={salesPOSData} companyData={companyData} />
      </div>
    </div>
  );
};

export default SalesPOS;