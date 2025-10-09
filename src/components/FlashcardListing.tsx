"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ImageSlider from "./ImageSlider";
import { CompoundCard, getImageByPath } from "@/helper/idb";

interface FlashcardListingProps {
  flashcard: CompoundCard | null;
  index: number;
}

const FlashcardListing = ({ flashcard, index }: FlashcardListingProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [validUrls, setValidUrls] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    const fetchValidUrls = async () => {
      if (flashcard) {
        const images = flashcard.cards
          .map((card) => card.src)
          .filter((src) => src && src.trim() !== "");
        const usableImages = await Promise.all(
          images.map(async (src) => await getImageByPath(src, "dataUrl"))
        );
        const usableUrls = usableImages
          .map((image) => image?.url || "")
          .filter((url) => url && typeof url === "string" && url.trim() !== "");

        console.log(usableUrls);

        setValidUrls(usableUrls as string[]);
      }
    };

    fetchValidUrls();
  }, [flashcard]);

  if (!flashcard || !isVisible) return <FlashcardPlaceholder />;

  if (isVisible && flashcard) {
    return (
      <Link
        className={cn("invisible h-full w-full cursor-pointer group/main", {
          "visible animate-in fade-in-5": isVisible,
        })}
        href={`/play?flashcard=${flashcard.id}`}
      >
        <div className="flex flex-col w-full">
          <ImageSlider urls={validUrls} />

          <div
            className="flex flex-col w-full px-2 pb-4 rounded-b-xl"
            style={{
              borderTop: "none",
              border: `2px solid ${flashcard.cards[0].theme || "#000000"}`,
            }}
          >
            <h3 className="mt-4 font-medium text-lg text-gray-700 line-clamp-2">
              {flashcard.idea}
            </h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {flashcard.description}
            </p>
            <p className="mt-1 font-medium text-sm text-gray-900">
              Set #{index + 1}
            </p>
          </div>
        </div>
      </Link>
    );
  }
};

const FlashcardPlaceholder = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative bg-zinc-100 aspect-video w-full overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-16 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-12 h-4 rounded-lg" />
    </div>
  );
};

export default FlashcardListing;
