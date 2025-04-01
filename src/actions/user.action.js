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

export const getDbUserId = async() => {

    const {userId:clerkId} = await auth();
    if(!clerkId) throw new Error("Unauthenticated!");

    const user = await getUserByClerkId(clerkId);

    if(!user) throw new Error("User not found");
    return user.id

}

export const getRandomUsers = async() => {

    try{
        const userId = await getDbUserId();
        //get 3 random users exclude ourselves and users that we already follow
        const randomUsers = await prisma.user.findMany({
            where: {
                AND:[
                    {NOT:{id:userId}},
                    {
                        NOT: {
                        followers:{
                           some: {
                            followerId: userId
                           }
                        }
                    }
                },
                ]
            },
            select:{
                id:true,
                name:true,
                username:true,
                image:true,
                _count:{
                    select:{
                        followers:true,
                    }
                }
            },
            take:3,
        })

        return randomUsers;

    }catch(error){

        console.log("Error fetching random users", error);
        return [];

    }
}