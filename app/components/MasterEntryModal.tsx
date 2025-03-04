import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

type MasterEntryFormFields = {
  id?: number;
  gold_16k: string;
  gold_18k: string;
  gold_22k: string;
  gold_24k: string;
  silver_pure: string;
  silver_ornamental: string;
  remarks: string | null;
  created_at?: string;
};

const MasterEntryModal: React.FC = () => {
  // Initial state for form fields
  const initialState: MasterEntryFormFields = {
    gold_16k: "0",
    gold_18k: "0",
    gold_22k: "0",
    gold_24k: "0",
    silver_pure: "0",
    silver_ornamental: "0",
    remarks: null,
  };

  // State management
  const [formFields, setFormFields] =
    useState<MasterEntryFormFields>(initialState);
  const [isOpen, setIsOpen] = useState(false);

  // Generic handler for input changes
  const handleInputChange = (
    field: keyof MasterEntryFormFields,
    value: string | null
  ) => {
    setFormFields((prev) => ({
      ...prev,
      [field]: value === "" ? "0" : value,
    }));
  };

  // Handler for form submission (update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const masterEntry = {
        id: formFields.id,
        gold_16k: parseFloat(formFields.gold_16k),
        gold_18k: parseFloat(formFields.gold_18k),
        gold_22k: parseFloat(formFields.gold_22k),
        gold_24k: parseFloat(formFields.gold_24k),
        silver_pure: parseFloat(formFields.silver_pure),
        silver_ornamental: parseFloat(formFields.silver_ornamental),
        remarks: formFields.remarks || null,
        created_at: formFields.created_at,
      };

      setIsOpen(false);
    } catch (error) {
      console.error("❌ Failed to update Master Entry:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <span onClick={() => setIsOpen(true)}>Master Entry</span>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="text-blue-700">
            Master Entry Update
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-4 gap-5 justify-between">
            {Object.keys(initialState)
              .filter(
                (key) =>
                  key !== "remarks" && key !== "id" && key !== "created_at"
              )
              .map((key) => (
                <div key={key} className="flex flex-col gap-2">
                  <Label htmlFor={key}>
                    {key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    step="0.01"
                    value={
                      formFields[key as keyof MasterEntryFormFields] || "0"
                    }
                    onChange={(e: any) =>
                      handleInputChange(
                        key as keyof MasterEntryFormFields,
                        e.target.value
                      )
                    }
                    required
                    placeholder={`Enter ${key
                      .replace(/_/g, " ")
                      .toLowerCase()}`}
                  />
                </div>
              ))}

            {/* Remarks field */}
            <div className="flex flex-col gap-2 col-span-4">
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Input
                id="remarks"
                value={formFields.remarks || ""}
                onChange={(e: any) =>
                  handleInputChange("remarks", e.target.value || null)
                }
                placeholder="Enter any additional remarks"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MasterEntryModal;
