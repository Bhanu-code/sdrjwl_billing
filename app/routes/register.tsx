// app/routes/register.tsx
import { useState } from "react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";

// Form validation schema
const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  businessType: z.string().min(1, "Please select a business type"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ActionData = {
  formError?: string;
  fieldErrors?: {
    fullName?: string[];
    email?: string[];
    businessType?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  fields?: {
    fullName: string;
    email: string;
    businessType: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const fullName = formData.get("fullName");
  const email = formData.get("email");
  const businessType = formData.get("businessType");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  // Validate form input
  try {
    registerSchema.parse({
      fullName,
      email,
      businessType,
      password,
      confirmPassword,
    });
  } catch (error) {
    const formattedErrors = error?.format();
    return json<ActionData>({
      fieldErrors: {
        fullName: formattedErrors.fullName?._errors,
        email: formattedErrors.email?._errors,
        businessType: formattedErrors.businessType?._errors,
        password: formattedErrors.password?._errors,
        confirmPassword: formattedErrors.confirmPassword?._errors,
      },
      fields: {
        fullName: fullName as string,
        email: email as string,
        businessType: businessType as string,
      },
    });
  }

  // TODO: Replace with actual user registration logic
  try {
    // await registerUser({ fullName, email, businessType, password });
    console.log("User registered successfully");
    return redirect("/login");
  } catch (error) {
    return json<ActionData>({
      formError: "Failed to create account. Please try again.",
      fields: {
        fullName: fullName as string,
        email: email as string,
        businessType: businessType as string,
      },
    });
  }
};

export default function Register() {
  const actionData = useActionData<ActionData>();
  const transition = useNavigation();
  const isSubmitting = transition.state === "submitting";
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const businessTypes = [
    "Sole Proprietorship",
    "Partnership",
    "Limited Liability Company (LLC)",
    "Corporation",
    "Non-profit Organization",
    "Freelancer",
    "Other",
  ];

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {actionData?.formError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{actionData.formError}</AlertDescription>
            </Alert>
          ) : null}
          
          <Form method="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                defaultValue={actionData?.fields?.fullName || ""}
                required
                placeholder="John Doe"
              />
              {actionData?.fieldErrors?.fullName ? (
                <p className="text-sm font-medium text-red-500">
                  {actionData.fieldErrors.fullName[0]}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={actionData?.fields?.email || ""}
                required
                placeholder="your@email.com"
              />
              {actionData?.fieldErrors?.email ? (
                <p className="text-sm font-medium text-red-500">
                  {actionData.fieldErrors.email[0]}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select name="businessType" defaultValue={actionData?.fields?.businessType || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {actionData?.fieldErrors?.businessType ? (
                <p className="text-sm font-medium text-red-500">
                  {actionData.fieldErrors.businessType[0]}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {actionData?.fieldErrors?.password ? (
                <p className="text-sm font-medium text-red-500">
                  {actionData.fieldErrors.password[0]}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {actionData?.fieldErrors?.confirmPassword ? (
                <p className="text-sm font-medium text-red-500">
                  {actionData.fieldErrors.confirmPassword[0]}
                </p>
              ) : null}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}