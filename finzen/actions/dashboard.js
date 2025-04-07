"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/dist/types/server";
import { revalidatePath } from "next/cache";

const serializeTransaction = (obj) => {
    const serialized = { ...obj };

    if(obj.balance){
        serialized.balance = obj.balance.toNumber();
    }  
};

export async function createAccount(data) {
    try{
        const { userId } = await auth();
        if(!userId) throw new Error("User not authenticated");

        const user = await db.user.findUnique({
            where:{ clerkUserId: userId},
        });
        if(!user) throw new Error("User not found");

        const balanceFloat = parseFloat(data.balance);
        if(isNaN(balanceFloat)) throw new Error("Invalid balance value");

        const existingAccounts = await db.account.findMany({
            where:{ userId: user.id},
        });

        const shouldbeDefault = existingAccounts.length === 0? true : data.isDefault;

        //If this account is default, set all other accounts to not default
        if(shouldbeDefault){
            await db.account.updateMany({
                where:{userId: user.id, isDefault: true},
                data:{ isDefault: false},
            });
        }

        const account = await db.account.create({
            data:{
                ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldbeDefault,
            },
        });

        const serializedAccount = serializeTransaction(account);

        revalidatePath("/dashboard");
        return { success: true, data: serializedAccount };



    } catch(error){
        throw new Error(error.message);
    }
}