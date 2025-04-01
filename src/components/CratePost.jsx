"use client";

import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import Image from "next/image";
import { ImageIcon, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { createPost } from "@/actions/post.action";
import toast from "react-hot-toast";

function CratePost() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;
    setIsPosting(true);
    try {
      const result = await createPost(content, imageUrl);
      if (result.success) {
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);

        toast.success("Post created seccesfully");
      } else {
        toast.error("Something went wrong in if block!");
      }
    } catch (error) {
      toast.error("Something went wrong in create post!");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg">
      <div className="flex items-start ">
        <Image
          src={user?.imageUrl || "/user.png"}
          alt=""
          width={50}
          height={50}
          className="rounded-full"
        />
        <div className="flex-1">
          <textarea
            id="message"
            rows="4"
            className="block p-2.5 w-full text-sm  border-b bg-transparent focus:outline-none "
            placeholder="what's in your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isPosting}
          ></textarea>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3 text-gray-500 text-sm">
              <Button
                className="text-muted-foreground hover:text-primary"
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                <ImageIcon className="text-gray-500 w-4 h-4" />
                <span>Photo</span>
              </Button>
            </div>

            <Button
              className="flex item-center"
              onClick={handleSubmit}
              disabled={isPosting || (!content.trim() && !imageUrl)}
            >
              {isPosting ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2" // ✅ Corrected
                    strokeLinecap="round" // ✅ Corrected
                    strokeLinejoin="round" // ✅ Corrected
                    className="lucide lucide-loader-icon lucide-loader"
                  >
                    <path d="M12 2v4" />
                    <path d="m16.2 7.8 2.9-2.9" />
                    <path d="M18 12h4" />
                    <path d="m16.2 16.2 2.9 2.9" />
                    <path d="M12 18v4" />
                    <path d="m4.9 19.1 2.9-2.9" />
                    <path d="M2 12h4" />
                    <path d="m4.9 4.9 2.9 2.9" />
                  </svg>
                  Posting...
                </>
              ) : (
                <div className="flex gap-2 items-center">
                  <Navigation />
                  <span>Post</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CratePost;
