"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { RiCopperCoinFill } from "react-icons/ri";
import { getCredentials } from "@/helper/idb";
import { usePathname } from "next/navigation";

function Profile() {
  const pathname = usePathname();
  const [nexoins, setNexoins] = useState<number>(0);

  useEffect(() => {
    const getCoins = async () => {
      const credentials = await getCredentials();
      if (credentials) {
        setNexoins(credentials.nexoins);
      }
    };
    getCoins();
  }, [pathname]);
  return (
    <nav className="flex flex-row items-center gap-4">
      <div className="flex flex-row items-center justify-center gap-1">
        {nexoins || 0} <RiCopperCoinFill />
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
