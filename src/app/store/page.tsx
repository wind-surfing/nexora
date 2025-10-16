"use client"

import ItemsListing from "@/components/ItemsListing";
import Button from "@/components/shared/Button";
import { itemsList } from "@/config";
import React from "react";

function Page() {
  return (
    <>
      <main className="flex flex-row items-center justify-center w-full px-4">
        <section className="py-8 w-4/5">
          <header className="w-full h-16 z-20 flex flex-row items-center justify-between bg-background sticky top-16 border-b">
            <h2 className="text-3xl">Nexora Store</h2>
            <div className="flex flex-row items-center justify-center gap-4">
              <Button title="Want a easter egg?"></Button>
            </div>
          </header>

          <div className="relative">
            <div className="mt-6 flex items-center w-full">
              <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 md:gap-y-10 lg:gap-x-8">
                {itemsList?.map((items, index) => (
                  <ItemsListing
                    key={`item-${index}`}
                    items={items}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Page;
