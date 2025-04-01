'use client'

import { useUser } from '@clerk/nextjs'
import React, { useState } from 'react'

function PostCard({post, dbUserId}) {


    const user = useUser();
    const [newComment, setNewComment] = useState("");
    const [isCommenting, setIsCommenting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [hasLiked, setHasLiked] = useState(post.likes.some(like => like.userId === dbUserId)); //user has already like it
    const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);


    const handleLike = async () => {
        if(isLiking) return; // it should not do anything in the second click
        
        try{
            setIsLiking(true);
            setHasLiked(prev => !prev); // !hasLike
            setOptimisticLikes(prev => prev + (hasLiked ? -1 : 1));
            await toggleLike(post.id);


        }catch(error){
            setOptimisticLikes(post._count.likes); //it means it failed we coulnot increment or decrement likes
            setHasLiked(post.likes.some(like => like.userId === dbUserId));
        }finally{
            setIsLiking(false);

        }
    }

    const handleAddComment = async () => {}

    const handleDeletePost = async () => {

    }

  return (
    <div>PostCard</div>
  )
}

export default PostCard