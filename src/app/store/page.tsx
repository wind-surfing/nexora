"use client";

import ItemsListing from "@/components/ItemsListing";
import Button from "@/components/shared/Button";
import { itemsList, mockUser } from "@/config";
import { getCredentials } from "@/helper/idb";
import { User } from "@/types/users";
import React, { useEffect, useState } from "react";

function Page() {
  const [user, setUser] = useState<User>(mockUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCredentials();
        if (user) {
          setUser({
            username: user.username,
            currentSignalGauge: user.currentSignalGauge || 5,
            requiredSignalGauge: user.requiredSignalGauge,
            currentSignalLevel: user.currentSignalLevel,
            lastSignalAt: user.lastSignalAt,
            nexoins: user.nexoins,
            ownedItems: user.ownedItems,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <main className="flex flex-row items-center justify-center w-full px-4">
        <section className="py-8 w-4/5">
          <header className="w-full h-16 z-20 flex flex-row items-center justify-between bg-background sticky top-16 border-b">
            <h2 className="text-3xl">Nexora Store</h2>
            <div className="flex flex-row items-center justify-center gap-4">
              <Button title="Want a gift?"></Button>
            </div>
          </header>

          <div className="relative">
            <div className="mt-6 flex items-center w-full">
              <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 md:gap-y-10 lg:gap-x-8">
                {itemsList?.map((items, index) => (
                  <ItemsListing
                    key={`item-${index}`}
                    user={user}
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
