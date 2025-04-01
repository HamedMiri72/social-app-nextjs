'use server'

import { prisma } from "@/lib/Prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export const createPost = async (content, image) => {

    try {
        const userId = await getDbUserId();
    
        if (!userId) return;
    
        const post = await prisma.post.create({
          data: {
            content,
            image,
            authorId: userId,
          },
        });
    
        revalidatePath("/"); // purge the cache for the home page
        return { success: true, post };
      } catch (error) {
        console.error("Failed to create post:", error);
        return { success: false, error: "Failed to create post" };
      }
};

export const getPosts = async() => {

  try{
    const posts = await prisma.post.findMany({
      orderBy:{
        createdAt: "desc" // very latest post at the top
      },
      include:{
        author: {
          select:{
            name: true,
            image: true,
            username: true,
          }
        },
        comments:{
          include:{
            author: {
              select:{
                id: true,
                username: true,
                image: true,
                name: true,

              }
            }
          },
          orderBy:{
            createdAt: "asc", // very latest comment at the buttom
          }

          },
          likes:{
            select:{
              userId: true,
            }
          },
          _count:{
            select:{
              likes:true,
              comments: true
            }
          }
        }
      })

      return posts;

  }catch(error){
    console.log("Error in fetching posts", error);
    throw new Error("Failed to fetch postes!");
  }
}

export const toggleLike = async(postId) => {

  try{

    const userId = await getDbUserId(); // check if user is authenticated or not
    if(!userId) return;

    //check if like exsists

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: {id: postId},
      select:{
        authorId: true,
      }
    });
    if(!post) throw new Error("Post not found!");

    if(existingLike){
      //unlike
      await prisma.like.delete({
        where: {
          userId_postId:{
            userId,
            postId
          },
        },
      });
    }else{
      //like and create notification (only if liking somone elses post)
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
            prisma.notification.create({
              data:{
                type: "LIKE",
                userId: post.authorId,
                creatorId: userId,
                postId,
              }
            })
          ]
          : []),
      ]);

    }

    revalidatePath("/")
    return {success: true};

  }catch{

    console.log("Falied to toggle like: ", error);
    return {success:false, error :"Failed to toggle like!"};

  }



}
