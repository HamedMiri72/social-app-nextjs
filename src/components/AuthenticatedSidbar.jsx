import { getUserByClerkId } from "@/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { Link, MapPinPlusInside } from "lucide-react";
import Image from "next/image";
import React from "react";

async function AuthenticatedSidbar() {
  
    const authUser = await currentUser();
    if(!authUser){
        return null;
    }
    
    const user = await getUserByClerkId(authUser.id);
    if(!user) return null;

    console.log(user);
  return (
    <div className="border p-4 rounded-lg">
      <div className="flex flex-col justify-between gap-3">
        <div className="w-full flex flex-col items-center justify-between gap-3 border-b pb-3">
          <Image src="/user.png" width={80} height={80} alt="userProfile" />
          <p>{user.name}</p>
          <span className="text-sm text-gray-400">{user.username}</span>
          {user.bio && <span className="text-sm text-gray-400">
            {user.bio}
          </span>}
        </div>
        <div className="flex items-center justify-between w-full border-b pb-3">
          <div className="flex flex-col items-center">
            <span>{user._count.following}</span>
            <p className="text-gray-400 text-sm">Following</p>
          </div>
          <div className="flex flex-col items-center">
            <span>{user._count.followers}</span>
            <p className="text-gray-400 text-sm">Followers</p>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-2 w-full text-sm text-gray-400">
          <div className="flex items-center justify-between gap-2">
            <MapPinPlusInside className="w-4 h-4" />
            <p>{user.location || "No Location"}</p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Link className="w-4 h-4"/>
            <p>{user.website || "No website"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthenticatedSidbar;
