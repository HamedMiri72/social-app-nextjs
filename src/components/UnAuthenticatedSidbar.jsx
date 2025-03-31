import { SignInButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";

function UnAuthenticatedSidbar() {
  return (
    <div className="border p-6 rounded-lg flex flex-col items-center">
      <div className="flex flex-col justify-between items-center">
        <p className="text-lg">Welcome Back!</p>
        <p className="text-sm text-center py-4 text-gray-500">
          Login to access your profile and connect with others.
        </p>
        <SignInButton mode="modal">
          <Button variant="outline" className="w-full">Login</Button>
        </SignInButton>
        <SignInButton mode="modal">
          <Button variant="default" className="w-full mt-2">Sign Up</Button>
        </SignInButton>

      </div>
    </div>
  );
}

export default UnAuthenticatedSidbar;
