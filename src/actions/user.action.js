'use server'

import { prisma } from "@/lib/Prisma";
import { auth, currentUser} from "@clerk/nextjs/server"

export const syncUser = async() => {

    try{

        const {userId} = await auth();
        const user = await currentUser()
        if(!userId || !user) return;

        //check if user exists

        const existingUser = await prisma.user.findUnique({
            where :{
                clerkId : userId,
            }
        })

        if(existingUser){
            return existingUser;
        }

        const userDb = await prisma.user.create({
            data:{
                clerkId: userId,
                name: `${user.firstName || ""} ${user.lastName || ""}`,
                username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
                email: user.emailAddresses[0].emailAddress,
                image: user.imageUrl,
            }
        })

        return userDb;
    }catch(error){

    }

}

export const getUserByClerkId = async(userId) => {

    return prisma.user.findUnique({
        where: {
            clerkId : userId
        },
        include:{
            _count: {
                select:{
                    followers: true,
                    following: true,
                    posts: true,
                },

            },
        },
    });

}