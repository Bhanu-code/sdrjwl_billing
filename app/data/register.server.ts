

// import { transporter } from "~/utils/transporter";
import { saveVerificationToken } from "./auth.server";
import { prisma } from "./database.server";
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';


interface RegistrationResponse {
    status: "success" | "error";
    message: string;
}

// Helper function to generate a unique ID
function createId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 13);
    const incrementPart = Math.floor(Math.random() * 10000).toString(36).padStart(4, "0");
    return `c_${timestamp}${randomPart}${incrementPart}`;
}

// Helper function to generate a verification token
function generateVerificationToken(): string {
    return createId();
}

// Helper function to hash passwords
async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

// Environment validation function
function validateEnvironmentVariables(): void {
    const requiredVars = ['APP_URL', 'EMAIL', 'PASSWORD'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Validate URL format
    try {
        new URL(process.env.APP_URL!);
    } catch (error) {
        throw new Error(`Invalid APP_URL format: ${process.env.APP_URL}`);
    }
}

// Helper function to construct verification link
function constructVerificationLink(token: string): string {
    const baseUrl = process.env.APP_URL!.replace(/\/+$/, ''); // Remove trailing slashes
    return `${baseUrl}/verify/${token}`;
}


// Main registration function with proper error handling and types
export async function registerUser({ fullName, email, businessType, password }:any): Promise<RegistrationResponse> {
    try {
        // Validate environment variables first
        validateEnvironmentVariables();
        
        // Log the current environment
        console.log('Current environment:', {
            NODE_ENV: process.env.NODE_ENV,
            // APP_URL: process.env.APP_URL,
        });

        const existingUser = await prisma.user.findFirst({ 
            where: { email: email } 
        });
        
        if (existingUser) {
            throw new Error('A user with this email already exists');
        }

        // Create user and send verification in a transaction
        await prisma.$transaction(async (prisma:any) => {
            const hashedPassword = await hashPassword(password);
            
            const newUser = await prisma.user.create({
                data: {
                    full_name: fullName,
                    email: email,
                    bussinessType: businessType,
                    isActive: false,
                    password: hashedPassword,
                }
            });

           
            
            return newUser;
        });



        return { 
            status: "success", 
            message: "Verification email sent successfully" 
        };

    } catch (error: any) {
        console.error('Registration failed:', error);
        
        return {
            status: "error",
            message: error.message || 'Registration failed. Please try again.'
        };
    }
}