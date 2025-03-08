import {
    ActionFunctionArgs,
    createCookieSessionStorage,
    redirect,
  } from "@remix-run/node";
  import { prisma } from "./database.server";
//   import { transporter } from "~/utils/transporter";
  import bcrypt from 'bcryptjs';
  
  // Optional: Function with additional security features
  function generateSecureOTP(): string {
    // Use crypto for better randomness
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    
    // Ensure 6-digit number
    const otp = (buffer[0] % 900000) + 100000;
    return otp.toString();
  }
  
  const sessionStorage = createCookieSessionStorage({
    cookie: {
      secure: process.env.NODE_ENV == "production",
      secrets: ["lube"],
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      httpOnly: true,
    },
  });
  
  export async function createUserSession(userId: string) {
    const session = await sessionStorage.getSession();
    session.set("userId", userId);
    return redirect("/master-entry", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  }
  
  export async function getUserFromSession(request: any) {
    const session = await sessionStorage.getSession(
      request.headers.get("Cookie")
    );
    const userId = session.get("userId");
  
    if(!userId){
      return null;
    }
  
    const user = await prisma.user.findFirst({
      where: { id: userId }
    })
  
    if (!user) {
      return null;
    } else {
      return user;
    }
  }
  
  export async function destroyUserSession(request: any) {
    const session = await sessionStorage.getSession(
      request.headers.get("Cookie")
    );
  
    return redirect("/", {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session),
      },
    });
  }
  
  
  export async function saveVerificationToken(email:any, verificationToken:any){
    const user = await prisma.user.findFirst({
      where :{email:email},
    })
    
    if(!user){
      return {msg:"No User Found!"}
    }
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: verificationToken
      }
    })
    if(!updated)
    {
      return {msg:"Failed to Update!"}
    }else{
      return {msg:"Verification Token Saved!!!"}
    }
  }
  export async function findUserByVerificationToken(token:any){
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
  
    })
  
    if(user){
      return user
    }else{
      return null;
    }
  }
  export async function markUserAsVerified(userId:any){
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isverified: true }
    })
  
    if(user){
      return user
    }else{
      return null;
    }
  }
  
  export async function sendOTP(email: string) {
    console.log('Sending OTP to email:', email);
    
    const user = await prisma.user.findFirst({
      where: { email: email }
    });
  
    if (!user) {
      return { message: 'No Account associated with this email' };
    }
  
    const otp = generateSecureOTP();
    const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    
    try {
      // Update user with new OTP and expiry
      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationToken: otp,
          tokenExpiry: tokenExpiry
        }
      });
      console.log('OTP stored in database');
  
    //   await transporter.sendMail({
    //     from: process.env.EMAIL,
    //     to: user.email,
    //     subject: "Reset Password OTP",
    //     html: `
    //       <h1>Password Reset Request</h1>
    //       <p>Your OTP for password reset is:</p>
    //       <h2>${otp}</h2>
    //       <p>This OTP will expire in 10 minutes.</p>
    //     `,
    //   });
      console.log('OTP email sent successfully');
  
      return redirect('/verify-otp?email=' + encodeURIComponent(email));
    } catch (error) {
      console.error('Error in sendOTP:', error);
      return {
        status: "error",
        message: "Failed to send verification email",
      };
    }
  }
  
  export async function storeOTP(email: string, otp: string) {
    const user = await prisma.user.findFirst({
      where: { email: email }
    });
  
    if (!user) {
      return { error: 'No user found with this email' };
    }
  
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          verificationToken: otp,
          tokenExpiry: new Date(Date.now() + 10 * 60 * 1000) // Token expires in 10 minutes
        }
      });
      return { success: true };
    } catch (error) {
      console.error('Error storing OTP:', error);
      return { error: 'Failed to store OTP' };
    }
  }
  
  // Verify OTP
  export async function verifyOTP(email: string, otp: string) {
    console.log('Verifying OTP for email:', email, 'OTP:', otp);
    
    const user = await prisma.user.findFirst({
      where: { 
        email: email,
        verificationToken: otp,
        tokenExpiry: {
          gte: new Date()
        }
      }
    });
  
    console.log('Found user:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('OTP verification failed');
      return { error: 'Invalid or expired OTP' };
    }
  
    return { success: true, userId: user.id };
  }
  
  
  // Update password
  export async function updatePassword(userId: number, newPassword: string) {
    console.log('Updating password for user ID:', userId);
    
    try {
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log('Password hashed successfully');
  
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { 
          password: hashedPassword,
          verificationToken: null,
          tokenExpiry: null
        }
      });
  
      console.log('Password updated successfully for user:', updatedUser.email);
      return { success: true };
    } catch (error) {
      console.error('Error updating password:', error);
      return { error: 'Failed to update password' };
    }
  }