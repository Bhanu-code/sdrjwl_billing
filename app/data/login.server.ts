import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { prisma } from "./database.server";
import { validatePasswordLength } from "./validation.server";
import bcrypt from 'bcryptjs';
import { createUserSession } from "./auth.server";



export async function loginUser(userData:any) {
    const existingUser = await prisma.user.findFirst({ where: { email: userData.email } });

    validatePasswordLength(userData.password);

    if(!existingUser){
        const error_msg = "User does not exists!"
        return error_msg;
    }

    const isPasswordValid = await bcrypt.compare(userData.password, existingUser.password);

    if(!isPasswordValid){
        const error_msg = "Invalid Password!"
        return error_msg;
    }

    return createUserSession(existingUser.id)
   
}