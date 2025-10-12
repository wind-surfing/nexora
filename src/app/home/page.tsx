"use client";

import Cards from "@/components/Cards";
import Button from "@/components/shared/Button";
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
              {/* <Button
                leftIcon={<GiMagicBroom />}
                type="button"
                title="Magic Guess"
              ></Button> */}
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
