"use client";

import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import Image from "next/image";
import { ImageIcon, Navigation } from "lucide-react";
import { Button } from "./ui/button";

function CratePost() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSubmit = async () => {};

  return (
    <div className="border p-4 rounded-lg">
      <div className="flex items-start ">
        <Image
          src={"/user.png"}
          alt=""
          width={50}
          height={50}
          className="rounded-full"
        />
        <div className="flex-1">
          <textarea
            id="message"
            rows="4"
            class="block p-2.5 w-full text-sm  border-b bg-transparent focus:outline-none "
            placeholder="what's in your mind?"
            value={content}
            onChange={(e)=> setContent(e.target.value)}
            disabled={isPosting}
          ></textarea>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3 text-gray-500 text-sm">
                <Button
                type="button"
                variant="sm"
                size="sm"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}>
                    <ImageIcon className="text-gray-500 w-4 h-4"/>
                </Button>
                
                <span>Photo</span>
            </div>

            <Button class="flex item-center">
                <Navigation/>
                <span>Post</span>
            </Button>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default CratePost;
