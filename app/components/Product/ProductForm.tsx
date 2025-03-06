import React, { useState } from 'react';
import { Form } from '@remix-run/react';
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

export type ProductFormFields = {
  product_name: string;
  gross_weight: string;
  net_weight: string;
  huid_no: string;
  hsn_code: string;
  sales_rate: string;
  unit: string;
  making_charges: string;
  hallmark_no: string;
  other_charges: string;
};

type ProductFormProps = {
  onSubmit: (data: ProductFormFields) => Promise<void>;
};

export function ProductForm({ onSubmit }: ProductFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formFields, setFormFields] = useState<ProductFormFields>({
    product_name: '',
    gross_weight: '',
    net_weight: '',
    huid_no: '',
    hsn_code: '',
    sales_rate: '',
    unit: '',
    making_charges: '',
    hallmark_no: '',
    other_charges: '',
  });

  const handleInputChange = (field: keyof ProductFormFields, value: string) => {
    setFormFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formFields);
      setIsOpen(false); // Close dialog on successful submission
      setFormFields({
        product_name: '',
        gross_weight: '',
        net_weight: '',
        huid_no: '',
        hsn_code: '',
        sales_rate: '',
        unit: '',
        making_charges: '',
        hallmark_no: '',
        other_charges: '',
      });
    } catch (error) {
      console.error('Product submission error:', error);
    }
  };

  const formConfig = [
    { key: 'product_name', label: 'Product Name', type: 'text', required: true },
    { key: 'gross_weight', label: 'Gross Weight', type: 'number', required: true, step: '0.01' },
    { key: 'net_weight', label: 'Net Weight', type: 'number', required: true, step: '0.01' },
    { key: 'huid_no', label: 'HUID No.', type: 'text', required: true },
    { key: 'hsn_code', label: 'HSN Code', type: 'text', required: true },
    { key: 'sales_rate', label: 'Sales Rate', type: 'number', required: true, step: '0.01' },
    { key: 'making_charges', label: 'Making Charges', type: 'number', required: true, step: '0.01' },
    { key: 'hallmark_no', label: 'Hallmark No.', type: 'text', required: true },
    { key: 'other_charges', label: 'Other Charges', type: 'number', step: '0.01' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>Add Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="text-blue-700">Add Product Information</DialogTitle>
        </DialogHeader>
        <Form method="post" onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-4">
            {formConfig
              .filter(field => field.key !== 'unit')
              .map(field => (
                <div key={field.key} className="flex flex-col gap-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <Input
                    id={field.key}
                    type={field.type}
                    step={field.step}
                    value={formFields[field.key as keyof ProductFormFields]}
                    onChange={(e) => handleInputChange(field.key as keyof ProductFormFields, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    required={field.required}
                  />
                </div>
            ))}
            <div className="flex flex-col gap-2">
              <Label>Unit</Label>
              <Select
                value={formFields.unit}
                onValueChange={(value) => handleInputChange('unit', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Weight(W)">Weight (W)</SelectItem>
                    <SelectItem value="Piece(P)">Piece (P)</SelectItem>
                    <SelectItem value="Percentage(%)">Percentage (%)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
              Save Product Information
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}