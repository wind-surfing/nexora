import Link from "next/link";
import React from "react";

function page() {
  return (
    <>
      <div className="flex flex-col gap-6 w-full h-[calc(100vh-64px)] items-center justify-center">
        <h1 className="text-2xl font-bold">Currently Pending</h1>
        <h2 className="text-xl">
          Please go to{" "}
          <Link className="text-primary" href="/create">
            Create Page
          </Link>
        </h2>
      </div>
    </>
  );
}

export default page;
