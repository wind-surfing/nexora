"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import ImageSlider from "./ImageSlider";
import { Badge } from "./ui/badge";
import { RiCopperCoinFill } from "react-icons/ri";
import { Items, User } from "@/types/users";

interface ItemsListingProps {
  user: User;
  items: Items;
  index: number;
}

const ItemsListing = ({ user, items, index }: ItemsListingProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    return () => clearTimeout(timer);
  }, [index]);

  if (!items || !isVisible) return <ItemsPlaceholder />;

  if (isVisible && items) {
    return (
      <main
        className={cn("invisible h-full w-full cursor-pointer group/main", {
          "visible animate-in fade-in-5": isVisible,
        })}
      >
        <div className="flex flex-col w-full">
          <ImageSlider urls={items.srcs} />

          <div
            className="flex flex-col w-full px-2 pb-4 rounded-b-xl"
            style={{
              borderTop: "none",
              border: `2px solid ${items.theme || "#000000"}`,
            }}
          >
            <h3 className="mt-4 font-medium text-lg text-gray-700 line-clamp-2 flex flex-row items-center justify-between">
              {items.title} {items.badge ? <Badge>{items.badge}</Badge> : null}
            </h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {items.description}
            </p>
            <p className="mt-1 font-medium text-sm text-gray-900 flex flex-row items-center gap-1">
              Price: <RiCopperCoinFill /> {items.price}
            </p>
            <div className="mt-3 flex flex-row items-center justify-center">
              <div className="h-6 w-full rounded overflow-hidden border-2 border-gray-700 shadow-inner relative">
                <div
                  className="h-full bg-primary/60 transition-all duration-1000 absolute top-0 left-0"
                  style={{
                    width: `${Math.min(
                      (user.currentSignalGauge / items.requiredSignalGauge) *
                        100,
                      100
                    ).toFixed(2)}%`,
                  }}
                ></div>
                <span
                  className="absolute inset-0 flex items-center justify-center text-[#2A2A2A]"
                  style={{ zIndex: 20 }}
                >
                  {Math.min(
                    (user.currentSignalGauge / items.requiredSignalGauge) * 100,
                    100
                  ).toFixed(2)}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
};

const ItemsPlaceholder = () => {
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

export default ItemsListing;
