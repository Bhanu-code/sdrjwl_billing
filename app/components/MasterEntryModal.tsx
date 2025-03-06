import React, { useState, useEffect } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const MasterEntryModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  
  // Provide a default empty object to prevent destructuring error
  const loaderData = useLoaderData() || { entry: null };
  const fetcher = useFetcher();
  const initialLoaderData = useLoaderData() || { entry: null };
  const [currentEntry, setCurrentEntry] = useState(initialLoaderData.entry);

  // Update entry when loader data changes or action is successful
  useEffect(() => {
    if (isOpen) {
      // Use fetcher to explicitly reload the data
      fetcher.load("/master-entry");
    }
  }, [isOpen]);

  // Update entry when action is successful
  useEffect(() => {
    if (fetcher.data?.entry) {
      setCurrentEntry(fetcher.data.entry);
    }
  }, [fetcher.data]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    // Determine intent based on whether entry exists
    formData.set('intent', currentEntry?.id ? 'update' : 'create');
    if (currentEntry?.id) formData.set('id', currentEntry.id.toString());

    fetcher.submit(formData, { 
      method: "POST", 
      action: "/master-entry" 
    });
  };

  // Default values for new entry
  const defaultEntry = {
    gold_16k: '0',
    gold_18k: '0',
    gold_22k: '0',
    gold_24k: '0',
    silver_pure: '0',
    silver_ornamental: '0',
    remarks: ''
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        setIsOpen(open);
        // Ensure data is fresh when opening
        if (open) {
          fetcher.load("/master-entry");
        }
      }}
    >
      <DialogTrigger>
        <span className="cursor-pointer">
          {currentEntry?.id ? 'Edit Master Entry' : 'Create Master Entry'}
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="text-blue-700">
            {currentEntry?.id ? 'Update Master Entry' : 'Create Master Entry'}
          </DialogTitle>
        </DialogHeader>
        
        <fetcher.Form method="POST" onSubmit={handleSubmit}>
          <div className="grid grid-cols-4 gap-5 justify-between">
            {[
              'gold_16k', 'gold_18k', 'gold_22k', 'gold_24k', 
              'silver_pure', 'silver_ornamental'
            ].map((key) => (
              <div key={key} className="flex flex-col gap-2">
                <Label htmlFor={key}>
                  {key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Label>
                <Input
                  id={key}
                  name={key}
                  type="number"
                  step="0.01"
                  defaultValue={
                    currentEntry?.[key as keyof typeof defaultEntry] || 
                    defaultEntry[key as keyof typeof defaultEntry]
                  }
                  required
                  placeholder={`Enter ${key
                    .replace(/_/g, " ")
                    .toLowerCase()}`}
                />
              </div>
            ))}

            <div className="flex flex-col gap-2 col-span-4">
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Input
                id="remarks"
                name="remarks"
                defaultValue={currentEntry?.remarks || ''}
                placeholder="Enter any additional remarks"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={fetcher.state === 'submitting'}
            >
              {fetcher.state === 'submitting' 
                ? 'Submitting...' 
                : (currentEntry?.id ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
};

export default MasterEntryModal;