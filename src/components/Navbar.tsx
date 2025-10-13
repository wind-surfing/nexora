import React from "react";
import Logo from "./Logo";
import Profile from "./Profile";
import Link from "next/link";

function Navbar() {
  return (
    <header className="w-full px-4 flex flex-row items-center justify-between sticky top-0 bg-background z-30 h-16 border-b">
      <nav>
        <ul className="flex flex-row items-center gap-6">
          <Link href={"/home"} className="relative group">
            <li className="flex flex-row items-center justify-center hover:text-primary">
              Home
            </li>
            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </Link>
          <Link href={"/create"} className="relative group">
            <li className="flex flex-row items-center justify-center hover:text-primary">
              Create
            </li>
            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </Link>
          <Link href={"/play"} className="relative group">
            <li className="flex flex-row items-center justify-center hover:text-primary">
              Play
            </li>
            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </Link>
          <Link href={"/store"} className="relative group">
            <li className="flex flex-row items-center justify-center hover:text-primary">
              Store
            </li>
            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </Link>
          <Link href={"/signal"} className="relative group">
            <li className="flex flex-row items-center justify-center hover:text-primary">
              Signal
            </li>
            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </Link>
        </ul>
      </nav>

      <Logo></Logo>

      <Profile></Profile>
    </header>
  );
}

export default Navbar;
