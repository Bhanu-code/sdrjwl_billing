import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import CompanyModal from "~/components/CompanyModal";
import { Button } from "~/components/ui/button";
import {
  editCompanyInfo,
  getCompanyInfo,
  saveCompanyInfo,
} from "~/data/company.server";

// Define the type for the action response
type ActionResponse = {
  status: number;
  msg: string;
};

const formatDate = (date: any) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const AboutCompany = () => {
  const companyData: any = useLoaderData();
  const actionData = useActionData() as ActionResponse;
  const companyExists = companyData !== null;

  return (
    <>
      <div className="bg-white p-4 shadow-md mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Company Information</h1>
        <Button className="bg-blue-600">
          {companyExists ? (
            <CompanyModal
              companyInfo={companyData}
              mode="edit"
              buttonText="Edit Company Details"
            />
          ) : (
            <CompanyModal mode="add" buttonText="Add Company Details" />
          )}
        </Button>
      </div>

      {actionData && (
        <div
          className={`p-4 mb-4 ${
            actionData.status === 201
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          } rounded-md`}
        >
          {actionData.msg}
        </div>
      )}

      {companyExists ? (
        <div className="grid grid-cols-1 p-6 md:grid-cols-2 gap-6">
          {/* Location Information */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
              Location
            </h2>
            <div className="space-y-2">
              <div>
                <span className="text-gray-500">City:</span>
                <span className="ml-2 font-medium">
                  {companyData?.city || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">District:</span>
                <span className="ml-2 font-medium">
                  {companyData?.district || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">State:</span>
                <span className="ml-2 font-medium">
                  {companyData?.state || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
              Contact
            </h2>
            <div className="space-y-2">
              <div>
                <span className="text-gray-500">Phone:</span>
                <span className="ml-2 font-medium">
                  {companyData?.contact_no || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">UPI ID:</span>
                <span className="ml-2 font-medium">
                  {companyData?.upi_id || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Registration Information */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
              Registration
            </h2>
            <div className="space-y-2">
              <div>
                <span className="text-gray-500">GSTIN:</span>
                <span className="ml-2 font-medium">
                  {companyData?.gstin_no || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">BIS Reg No:</span>
                <span className="ml-2 font-medium">
                  {companyData?.bis_reg_no || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">PAN:</span>
                <span className="ml-2 font-medium">
                  {companyData?.pan_no || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
              System Info
            </h2>
            <div className="space-y-2">
              <div>
                <span className="text-gray-500">Company Name:</span>
                <span className="ml-2 font-medium">
                  {companyData?.company_name}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Company ID:</span>
                <span className="ml-2 font-medium">{companyData?.id}</span>
              </div>
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-2 font-medium">
                  {formatDate(companyData?.created_at)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Last Updated:</span>
                <span className="ml-2 font-medium">
                  {formatDate(companyData?.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              No Company Information Available
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't added any company information yet. Click the "Add
              Company Details" button to get started.
            </p>
            <Button className="bg-blue-600">
              <CompanyModal mode="add" buttonText="Add Company Details" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export async function loader({ request }: LoaderFunctionArgs) {
  return getCompanyInfo();
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const userData = Object.fromEntries(formData);

  console.log("Form data received:", userData);

  const formType: any = userData?.form_type;

  if (formType === "edit-form") {
    return editCompanyInfo(userData);
  } else {
    return saveCompanyInfo(userData);
  }
}

export default AboutCompany;