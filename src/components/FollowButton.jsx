'use client'

import React, { useState } from 'react'
import { Button } from './ui/button';
import { Loader2Icon } from 'lucide-react';
import toast from 'react-hot-toast';
import { toggleFollow } from '@/actions/user.action';

function FollowButton({userId}) {

    const[isLoading, setIsLoading] = useState("");



    const handleFollow = async() =>{
        setIsLoading(true);
        try{
            await toggleFollow(userId);
            toast.success("successfully follow the user!")

        }catch(error){
            toast.error("Somthing went wrong while following user")
        }finally{
            setIsLoading(false);
        }
    }
  return (
    <Button variant="secondary" size="sm"
    onClick={handleFollow}
    disabled={isLoading}
    className="w-20">

        {isLoading ? <Loader2Icon className='size-4 animate-spin'/> : "Follow"}

    </Button>
  )
}

export default FollowButton