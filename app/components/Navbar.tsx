import { Form } from "@remix-run/react";
import AddCompanyModal from "./AddCompanyModal";
import AddCustomerModal from "./AddCustomerModal";
import MasterEntryModal from "./MasterEntryModal";
import { Button } from "./ui/button";

type NavbarProps = {
  companyInfo?: {
    id?: number;
    company_name?: string;
    city?: string;
    district?: string;
    state?: string;
    contact_no?: string;
    gstin_no?: string | null;
    upi_id?: string | null;
    logo_path?: string | null;
    created_at?: string;
    bis_reg_no?: string | null;
    pan_no?: string | null;
  } | null;
};

const Navbar = ({ companyInfo }: NavbarProps) => {
  const companyExists = companyInfo && companyInfo.id;


  const handleCustomerAdded = () => {
    // Here you can implement the refresh logic
    // For example, you might want to:
    // - Refresh a global state
    // - Trigger a data refetch
    // - Update a context
    console.log("Customer added - triggering refresh");
  };

  return (
    <div className="flex px-5 py-1 justify-between flex-wrap items-center">

      <Button className="bg-white shadow-none text-black hover:bg-blue-400 hover:text-white" >
        {companyExists ? (
          <AddCompanyModal 
            companyInfo={companyInfo} 
            mode="edit" 
            buttonText="Edit Company Info" 
          />
        ) : (
          <AddCompanyModal 
            mode="add" 
            buttonText="Add Company Info" 
          />
        )}

      </Button>
      <Button className="bg-white shadow-none text-black hover:bg-blue-400 hover:text-white">
        <MasterEntryModal />
      </Button>
      <Button className="bg-white shadow-none text-black hover:bg-blue-400 hover:text-white">
        <AddCustomerModal onCustomerAdded={handleCustomerAdded} />
      </Button>
      <Button className="bg-white shadow-none text-black hover:bg-blue-400 hover:text-white">
        Database
      </Button>
      <Button className="bg-white shadow-none text-black hover:bg-blue-400 hover:text-white">
        Salesman
      </Button>
      <Button className="bg-white shadow-none text-black hover:bg-blue-400 hover:text-white">
        Supplier
      </Button>
      <Button className="bg-white shadow-none text-black hover:bg-blue-400 hover:text-white">
        Purchase
      </Button>
      <Button className="bg-white shadow-none text-black hover:bg-blue-400 hover:text-white">
        Service
      </Button>
      {/* <Button className="bg-white shadow-none text-black hover:bg-blue-400 hover:text-white" >Voucher</Button>
      <Button className="bg-white shadow-none text-black hover:bg-blue-400 hover:text-white" >Sales</Button>
      <Button className="bg-white shadow-none text-black hover:bg-blue-400 hover:text-white" >SMS</Button>
      <Button className="bg-white shadow-none text-black hover:bg-blue-400 hover:text-white" >Records</Button>
      <Button className="bg-white shadow-none text-black hover:bg-blue-400 hover:text-white" >Reports</Button> */}
      <Form method="delete" action="./logout">
        <Button
          onClick={(e: any) => {}}
          className="bg-white shadow-none text-black hover:bg-blue-400 hover:text-white"
        >
          Logout
        </Button>
      </Form>
    </div>
  );
};

export default Navbar;
