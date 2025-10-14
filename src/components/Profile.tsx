"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { RiCopperCoinFill } from "react-icons/ri";
import { useUser } from "@/context/UserContext";
import { mockUser } from "@/config";

function Profile() {
  const { user = mockUser } = useUser();

  return (
    <nav className="flex flex-row items-center gap-4">
      <div className="flex flex-row items-center justify-center gap-1">
        {user.nexoins || 0} <RiCopperCoinFill />
      </div>

      <span className="h-6 bg-muted w-0.5" />

      <Avatar className="w-10 h-10 border cursor-pointer">
        <AvatarImage src={"/nexora.svg"} alt="Nexora"></AvatarImage>
        <AvatarFallback></AvatarFallback>
      </Avatar>
    </nav>
  );
}

export default Profile;
