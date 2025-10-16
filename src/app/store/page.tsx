"use client";

import ItemsListing from "@/components/ItemsListing";
import Button from "@/components/shared/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { itemsList } from "@/config";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

function Page() {
  const router = useRouter();
  const [rawSignalGuess, setRawSignalGuess] = useState<string>("");

  const handleMagicSignalGuess = () => {
    if (!rawSignalGuess) {
      toast.error("Please enter a signal.");
      return;
    }

    if (
      rawSignalGuess.trim().toLowerCase() ===
      process.env.NEXT_PUBLIC_MAGIC_SIGNAL?.toLowerCase()
    ) {
      toast.success("Magic signal is correct! And, providing easter egg!");
      router.push(process.env.NEXT_PUBLIC_EASTER_EGG_URL || "/");
      setRawSignalGuess("");
    } else {
      toast.error("Magic signal is incorrect. Try again.");
      setRawSignalGuess("");
    }
  };

  return (
    <>
      <main className="flex flex-row items-center justify-center w-full px-4">
        <section className="py-8 w-4/5">
          <header className="w-full h-16 z-20 flex flex-row items-center justify-between bg-background sticky top-16 border-b">
            <h2 className="text-3xl">Nexora Store</h2>
            <div className="flex flex-row items-center justify-center gap-4">
              <Popover>
                <PopoverTrigger>
                  <Button title="Want a easter egg?"></Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="leading-none font-medium">
                        Easter Egg Hunt
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        Find the easter egg signal and get a surprise!
                      </p>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="signal">Signal</Label>
                      <Input
                        id="signal"
                        type="text"
                        className="col-span-2 h-8"
                        value={rawSignalGuess}
                        onChange={({ target: { value } }) =>
                          setRawSignalGuess(value)
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Button
                          onClick={() => handleMagicSignalGuess()}
                          type="button"
                          title="Test signal"
                        ></Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
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
