import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { json, LoaderFunction } from "@remix-run/node";

import "./tailwind.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { ToastProvider } from "./components/ui/toast";
import { getCompanyInfo } from "./data/company.server";

// Define the type for our loader data
type RootLoaderData = {
  companyInfo: any;  // You could define a more specific type based on your company data structure
};

// Create a loader function to fetch company data
export const loader: LoaderFunction = async () => {
  const companyInfo = await getCompanyInfo();
  return json({ companyInfo });
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // Use the loader data in the root component
  const { companyInfo } = useLoaderData<RootLoaderData>();
  
  return (
    <>
      <div className="w-screen h-screen overflow-hidden">
        <Navbar companyInfo={companyInfo} />
        <div className="flex">
          <div className="w-[12rem]">
            <Sidebar />
          </div>
          <div className="flex-1 h-screen">
            <ToastProvider>
              <Outlet />
            </ToastProvider>
          </div>
        </div>
      </div>
    </>
  );
}