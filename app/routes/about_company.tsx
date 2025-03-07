import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import AddCompanyModal from "~/components/AddCompanyModal";
import EditCompanyModal from "~/components/EditCompanyModal";
import { Button } from "~/components/ui/button";
import {
  editCompanyInfo,
  getCompanyInfo,
  saveCompanyInfo,
} from "~/data/company.server";

const formatDate = (date: any) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const about_company = () => {
  const companyData: any = useLoaderData();

  // console.log("actionData", companyData)

  return (
    <>
      <Button className="bg-blue-600 m-2">
        <EditCompanyModal companyInfo={companyData} />
        {/* <AddCompanyModal companyInfo={companyData} /> */}
      </Button>
      <div className="grid grid-cols-1 p-10 md:grid-cols-2 gap-6">
        {/* Location Information */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
            Location
          </h2>
          <div className="space-y-2">
            <div>
              <span className="text-gray-500">City:</span>
              <span className="ml-2 font-medium">
                {companyData.city || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">District:</span>
              <span className="ml-2 font-medium">
                {companyData.district || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">State:</span>
              <span className="ml-2 font-medium">
                {companyData.state || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
            Contact
          </h2>
          <div className="space-y-2">
            <div>
              <span className="text-gray-500">Phone:</span>
              <span className="ml-2 font-medium">
                {companyData.contact_no || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">UPI ID:</span>
              <span className="ml-2 font-medium">
                {companyData.upi_id || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Registration Information */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
            Registration
          </h2>
          <div className="space-y-2">
            <div>
              <span className="text-gray-500">GSTIN:</span>
              <span className="ml-2 font-medium">
                {companyData.gstin_no || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">BIS Reg No:</span>
              <span className="ml-2 font-medium">
                {companyData.bis_reg_no || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">PAN:</span>
              <span className="ml-2 font-medium">
                {companyData.pan_no || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
            System Info
          </h2>
          <div className="space-y-2">
            <div>
              <span className="text-gray-500">Company Name:</span>
              <span className="ml-2 font-medium">{companyData.company_name}</span>
            </div>
            <div>
              <span className="text-gray-500">Company ID:</span>
              <span className="ml-2 font-medium">{companyData.id}</span>
            </div>
            <div>
              <span className="text-gray-500">Created:</span>
              <span className="ml-2 font-medium">
                {formatDate(companyData.created_at)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <span className="ml-2 font-medium">
                {formatDate(companyData.updated_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function loader({ request }: LoaderFunctionArgs) {
  return getCompanyInfo();
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const userData = Object.fromEntries(formData);

  console.log(userData);

  const formType: any = userData?.form_type;

  if (formType === "edit-form") {
    return editCompanyInfo(userData);
  } else {
    return saveCompanyInfo(userData);
  }

}

export default about_company;
