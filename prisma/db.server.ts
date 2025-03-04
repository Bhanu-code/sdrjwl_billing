import { PrismaClient } from "@prisma/client";

declare global {
    var __db: any;
  }

  let prisma:any;

if(process.env.ENV=="production"){
    prisma = new PrismaClient();
    prisma.$connect()
}else{
    if(!global.__db){
        global.__db = new PrismaClient();
        global.__db.$connect()
    }
    prisma = global.__db;
}

export { prisma };