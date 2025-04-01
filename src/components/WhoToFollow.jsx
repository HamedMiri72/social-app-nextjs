import { getRandomUsers } from "@/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import React from "react";
import FollowButton from "./FollowButton";

async function WhoToFollow() {
  const users = await getRandomUsers();
  if (users.length == 0) return null;

  return ( 
    <div className="border p-4 rounded-lg flex flex-col">
      <h1>Who to follow</h1>

      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between mt-6">
          <div className="flex items-center w-full justify-between gap-1">
            <Image
              src={user?.imageUrl || "/user.png"}
              alt="image"
              width={40}
              height={40}
              className="rounded-full "
            />
            <div>
                <p>{user.name}</p>
                <p>@{user.username}</p>
                <p>{user._count.followers} followers</p>
            </div>
            <FollowButton userId={user.id}/>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WhoToFollow;
