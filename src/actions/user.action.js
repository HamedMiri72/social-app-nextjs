'use server'

import { prisma } from "@/lib/Prisma";
import { auth, currentUser} from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

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

export const toggleFollow = async(targetUserId) => {
    const userId = await getDbUserId();

    try{

        if(userId === targetUserId) throw new Error("you can not follow yourself");

        const exsistingFollow = await prisma.follows.findUnique({
            where: {
                followerId_followingId:{
                    followerId: userId,
                    followingId: targetUserId
                }
            }
        })
        if(exsistingFollow){
            //unfollow
            await prisma.follows.delete({
                where:{
                    followerId_followingId:{
                        followerId:userId,
                        followingId: targetUserId,
                    }
                }
            })
        }else{
            //follow transaction all of them or non of them
           await prisma.$transaction([
            prisma.follows.create({
                data:{
                    followerId: userId,
                    followingId:targetUserId,
                }
            }),

            prisma.notification.create({
                data: {
                    type:"FOLLOW",
                    userId: targetUserId, // user Being Followed
                    creatorId: userId
                }
            })

           ])
        }
        revalidatePath("/")
        return {success: true}

    }catch(error){
        console.log("Somthing went wrong in follow action", error);
        return {success: false, error: "error toggling follow"};
    }
}