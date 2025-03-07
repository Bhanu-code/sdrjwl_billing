import React, { useEffect, useState } from 'react';
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "./ui/dialog";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Define the SalesPOS interface to resolve type errors
interface SalesPOS {
  product_code: string;
  product_name: string;
  customer_name?: string;
  contact_number?: string;
  gstin_no?: string;
  gold_price: number;
  net_weight: number;
  sales_total: number;
  total_rate: number;
  gst_type: 'gst' | 'igst';
  created_at: string | Date;
}

// Define the GST details interface
interface GSTDetails {
  gstType: string;
  cgstRate?: number;
  sgstRate?: number;
  igstRate?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  totalGST: number;
  totalAmount: number;
}

interface CompanyInvoiceDetails {
  company_name: string;
  address: string;
  gstin_no: string;
  bis_reg_no: string;
}

// Define the props interface
interface InvoiceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  saleData: SalesPOS; 
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ 
  isOpen, 
  onOpenChange, 
  saleData 
}) => {
  // Company static details
  const [companyDetails, setCompanyDetails] = useState<CompanyInvoiceDetails>({
    company_name: "Company Name",
    address: "Company Address",
    gstin_no: "GSTIN Number",
    bis_reg_no: "BIS Reg Number"
  });

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      // Fetch company details logic here
    };

    fetchCompanyDetails();
  }, []);

  // Calculate GST details 
  const calculateGSTDetails = (sale: SalesPOS): GSTDetails => {
    const taxableValue = sale.total_rate;
    
    if (sale.gst_type === 'gst') {
      const cgstRate = 0.015; // 1.5%
      const sgstRate = 0.015; // 1.5%
      
      const cgstAmount = taxableValue * cgstRate;
      const sgstAmount = taxableValue * sgstRate;
      
      return {
        gstType: 'CGST & SGST',
        cgstRate: cgstRate * 100,
        sgstRate: sgstRate * 100,
        cgstAmount,
        sgstAmount,
        totalGST: cgstAmount + sgstAmount,
        totalAmount: taxableValue + cgstAmount + sgstAmount
      };
    } else {
      const igstRate = 0.03; // 3%
      
      const igstAmount = taxableValue * igstRate;
      
      return {
        gstType: 'IGST',
        igstRate: igstRate * 100,
        igstAmount,
        totalGST: igstAmount,
        totalAmount: taxableValue + igstAmount
      };
    }
  };

  // Calculate GST details for the current sale
  const gstDetails = calculateGSTDetails(saleData);

  // Convert number to words for total amount
  const numberToWords = (num: number): string => {
    const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    function inWords(n: number): string {
      if (n < 20) return a[n];
      if (n < 100) {
        return b[Math.floor(n / 10)] + " " + a[n % 10];
      }
      if (n < 1000) {
        return a[Math.floor(n / 100)] + "hundred " + inWords(n % 100);
      }
      if (n < 100000) {
        return inWords(Math.floor(n / 1000)) + "thousand " + inWords(n % 1000);
      }
      return inWords(Math.floor(n / 100000)) + "lakh " + inWords(n % 100000);
    }

    return inWords(Math.floor(num)).trim() + " rupees";
  };

  // Function to handle PDF generation
  const handleDownloadPDF = () => {
    const input = document.getElementById('invoice-content');
    if (input) {
      // Increase the scale for better resolution
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Calculate the height to fit the content on a single page 
        const pageHeight = (imgHeight * imgWidth) / canvas.width;
        
        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        // Save the PDF
        pdf.save(`Invoice_${saleData.product_code}.pdf`);
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] h-4/5 overflow-y-auto">
        <div id="invoice-content" className="invoice p-4">
          {/* Header */}
          <div className="header flex justify-between p-2 text-blue-500 border-[1px] border-slate-900">
            <div className="left calistoga-regular">
              <h1>{companyDetails.company_name}</h1>
              <h2 className="ml-12">- GOLD & SILVER</h2>
              <p>{companyDetails.address}</p>
              <p>BIS CERTIFIED HALLMARK JEWELLERY SHOWROOM</p>
            </div>
            <div className="right">
              <p>GSTIN: {companyDetails.gstin_no}</p>
              <p>BIS REG. No.: {companyDetails.bis_reg_no}</p>
            </div>
          </div>
          {/* Customer Info */}
          <div className="customer_info p-2 grid grid-cols-2 gap-2 border-[1px] border-slate-900">
            <span><strong>Buyer Information</strong></span>
            <span><strong>Date</strong>: {new Date(saleData.created_at).toLocaleDateString()}</span>
            <span><strong>Name</strong>: {saleData.customer_name || 'Walk-in Customer'}</span>
            <span><strong>Invoice No</strong>: {saleData.product_code}</span>
            <span><strong>Contact No</strong>: {saleData.contact_number || 'N/A'}</span>
            <span><strong>Payment Mode</strong>: Cash</span>
            <span><strong>GSTIN</strong>: {saleData.gstin_no || 'N/A'}</span>
            <span><strong>Reference</strong>: -</span>
          </div>

          {/* Gold Rate Section */}
          <div className="gold-rate ml-10">
            <p><strong>Gold Rate/gm(916)</strong> Rs. {saleData.gold_price.toFixed(2)}</p>
            <p><strong>Add on Value/gm(916)</strong> Rs. 600.00</p>
          </div>

          {/* Product Table */}
          <div className="table w-full">
            <table className="border-[1px] p-5 w-full border-slate-900">
              <thead className="border-[1px] border-slate-900">
                <tr className="text-left p-2 gap-x-2">
                  <th className="px-2">S.No.</th>
                  <th className="px-16">Product Description</th>
                  <th className="px-2">Purity</th>
                  <th className="px-5">HSN</th>
                  <th className="px-2">Quantity</th>
                  <th className="px-2">G.Weight(gm)</th>
                  <th className="px-2">N.Weight(gm)</th>
                  <th className="px-8">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="px-2">1</td>
                  <td className="px-10">{saleData.product_name}</td>
                  <td className="px-2">916</td>
                  <td className="px-2">7113</td>
                  <td className="px-2">1</td>
                  <td className="px-2">{saleData.net_weight.toFixed(2)}</td>
                  <td className="px-2">{saleData.net_weight.toFixed(2)}</td>
                  <td className="px-2">₹{saleData.sales_total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Details */}
          <div className="add-ons">
            <div className="ml-auto w-1/3">
              <div className="flex justify-between">
                <span><strong>Total Value Before Tax</strong></span>
                <span>₹{saleData.sales_total.toFixed(2)}</span>
              </div>
              
              {/* GST Breakdown */}
              {saleData.gst_type === 'gst' ? (
                <>
                  <div className="flex justify-between">
                    <span><strong>SGST 1.5%</strong></span>
                    <span>₹{gstDetails.sgstAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span><strong>CGST 1.5%</strong></span>
                    <span>₹{gstDetails.cgstAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span><strong>IGST 3%</strong></span>
                  <span>₹{gstDetails.igstAmount?.toFixed(2) || '0.00'}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span><strong>Total Value After Tax</strong></span>
                <span>₹{gstDetails.totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span><strong>Round Off</strong></span>
                <span>₹0.00</span>
              </div>
              
              <div className="flex justify-between">
                <span><strong>Hallmark/HUID Charge</strong></span>
                <span>₹50.00</span>
              </div>
              
              <div className="flex justify-between">
                <span><strong>Total Payable Amount</strong></span>
                <span className="border-[1px] border-slate-900 p-1">
                  ₹{gstDetails.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="amt-in-words mt-4">
            <p className="font-bold underline">Amount in Words</p>
            <p>{numberToWords(Math.round(gstDetails.totalAmount))}</p>
          </div>

          {/* Declaration */}
          <div className="declaration w-1/2 mt-4">
            <p className="font-bold underline">Declaration</p>
            <p>- We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
            <p>- Products received by the customer in good condition.</p>
            <p>- Subjected to Midnapore Jurisdiction.</p>
          </div>

          {/* Signatory */}
          <div className="signatory flex justify-between mt-12">
            <div className="cust-sign">
              <span className="underline w-1/3"><hr className="border-[1px] border-slate-900" /></span>
              <span>Customer Signature</span>
            </div>
            <div className="cust-sign">
              <span className="underline w-1/3"><hr className="border-[1px] border-slate-900" /></span>
              <span>For Sunderbai Jewellery <br /> (Authorized Signatory)</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            className="bg-blue-600" 
            type="button" 
            onClick={handleDownloadPDF}
          >
            Download Invoice PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;