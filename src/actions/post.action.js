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
