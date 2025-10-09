import { CompoundCard } from "@/helper/idb";
import React from "react";
import FlashcardListing from "./FlashcardListing";

function Cards({
  flashCards,
  magicallyPickedIndex,
}: {
  flashCards?: CompoundCard[];
  magicallyPickedIndex: number | null;
}) {
  return (
    <div className="relative">
      <div className="mt-6 flex items-center w-full">
        <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 md:gap-y-10 lg:gap-x-8">
          {flashCards?.map((flashcard, i) => (
            <FlashcardListing
              key={`flashcard-${i}`}
              magicallyPickedIndex={magicallyPickedIndex}
              flashcard={flashcard}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cards;
