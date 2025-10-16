"use client";

import Cards from "@/components/Cards";
import Button from "@/components/shared/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CompoundCard, getCompoundCards } from "@/helper/idb";
import React, { useEffect, useState } from "react";
import { GiCardRandom, GiMagicBroom } from "react-icons/gi";

function Page() {
  const [flashCards, setFlashCards] = useState<CompoundCard[]>([]);
  const [magicallyPickedIndex, setMagicallyPickedIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchFlashcards = async () => {
      const cards = await getCompoundCards();
      setFlashCards(cards);
    };

    fetchFlashcards();
  }, []);

  const handleMagicPick = () => {
    if (flashCards.length === 0) return;
    const randomIndex = Math.floor(Math.random() * flashCards.length);
    setMagicallyPickedIndex(randomIndex);
  };

  return (
    <>
      <main className="flex flex-row items-center justify-center w-full px-4">
        <section className="py-8 w-4/5">
          <header className="flex flex-row items-center justify-between sticky top-16 z-20 bg-background h-16 w-full border-b">
            <h2 className="text-3xl">Let&apos;s Do Flashcards</h2>
            <div className="flex flex-row items-center justify-center gap-4">
              <Popover>
                <PopoverTrigger>
                  <Button
                    leftIcon={<GiMagicBroom />}
                    type="button"
                    title="Magic Guess"
                  ></Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="leading-none font-medium">
                        Your Prediction
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        Are you confident about this?
                      </p>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="guess">Guess</Label>
                      <Input
                        id="guess"
                        type="text"
                        className="col-span-2 h-8"
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Button type="button" title="Confirm"></Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                onClick={handleMagicPick}
                leftIcon={<GiCardRandom />}
                type="button"
                title="Magic Pick"
              ></Button>
            </div>
          </header>

          <Cards
            magicallyPickedIndex={magicallyPickedIndex}
            flashCards={flashCards}
          ></Cards>
        </section>
      </main>
    </>
  );
}

export default Page;
