"use client";

import Button from "@/components/shared/Button";
import React from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaPlus,
  FaShuffle,
  FaWandMagicSparkles,
} from "react-icons/fa6";
import {
  GiHealthIncrease,
  GiHealthPotion,
  GiMagicPotion,
} from "react-icons/gi";
import { AiFillSound } from "react-icons/ai";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function page() {
  return (
    <>
      <main className="flex flex-row items-center justify-center h-[calc(100vh-64px)] w-full px-4">
        <section className="h-full w-4/5">
          <header className="flex flex-row items-center justify-between h-16 w-full border-b">
            <h2 className="text-3xl">Flashcards</h2>
            <div className="flex flex-col items-center justify-center gap-2">
              <span>1 / 20</span>
              <span>Set #1: Flashcard Title</span>
            </div>
            <div className="flex flex-row items-center justify-center gap-8">
              <Button type="button" title="Turn these into Quiz"></Button>
              <div className="flex flex-row items-center justify-center gap-2">
                <span className="flex flex-row items-center justify-center gap-1">
                  <GiHealthPotion /> 3
                </span>
                <span className="flex flex-row items-center justify-center gap-1">
                  <GiMagicPotion /> 3
                </span>
              </div>
            </div>
          </header>
          <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-128px)]">
            <div className="flex flex-row items-center justify-between w-full h-full">
              <main className="flex flex-col items-start justify-start w-5/8 h-full">
                <section className="aspect-video w-full bg-primary text-white rounded-2xl m-4 px-4 flex flex-col items-start justify-start relative overflow-hidden">
                  <header
                    style={{ zIndex: 10 }}
                    className="w-full flex flex-row items-center justify-between absolute top-4 left-0 px-6"
                  >
                    <span className="flex flex-row items-center gap-2">
                      <FaWandMagicSparkles className="text-xl" />
                      <span className="sr-only">Hint Content</span>
                    </span>
                    <span className="flex flex-row items-center gap-2">
                      <AiFillSound className="text-xl" />
                    </span>
                  </header>
                  <div className="h-full w-full flex flex-row items-center justify-center">
                    <span style={{ zIndex: 10 }} className="text-4xl">
                      Term / Question
                    </span>
                    <Image
                      src="/nexora.svg"
                      alt="Flashcard Image"
                      layout="fill"
                      objectFit="cover"
                      style={{
                        opacity: 0.2,
                      }}
                    />
                  </div>
                </section>
                <section className="w-full m-4 p-4 flex flex-row items-center justify-between rounded-xl">
                  <span className="flex flex-row items-center gap-2">
                    <span className="text-lg">HP</span>
                    <div className="h-6 w-24 rounded overflow-hidden border-2 border-gray-700 shadow-inner relative">
                      <div
                        className="h-full bg-primary/60 transition-all duration-300 absolute top-0 left-0"
                        style={{ width: "50%" }}
                      ></div>
                      <div
                        className="h-full bg-primary/5 transition-all duration-300 absolute top-0 left-0"
                        style={{ width: "80%" }}
                      ></div>
                      <span
                        className="absolute inset-0 flex items-center justify-center text-[#2A2A2A]"
                        style={{ zIndex: 20 }}
                      >
                        100%
                      </span>
                    </div>
                    <span className="flex items-center justify-center">
                      <Popover>
                        <PopoverTrigger className="flex flex-row items-center justify-center text-primary cursor-pointer">
                          <Tooltip>
                            <TooltipTrigger type="button">
                              <FaPlus />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Increase HP by 30%</p>
                            </TooltipContent>
                          </Tooltip>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="leading-none font-medium">
                                Confirm
                              </h4>
                              <p className="text-muted-foreground text-sm">
                                Are you sure you want to spend 1 HP potion to
                                recover health
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Button type="button" title="Confirm"></Button>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </span>
                  </span>
                  <span className="flex flex-row items-center gap-4">
                    <Tooltip>
                      <TooltipTrigger
                        type="button"
                        className="flex flex-row items-center justify-center p-2 h-10 w-14 rounded-full bg-muted/50 hover:bg-muted text-primary cursor-pointer"
                      >
                        <FaArrowLeft />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Move the previous one</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger
                        type="button"
                        className="flex flex-row items-center justify-center p-2 h-10 w-14 rounded-full bg-muted/50 hover:bg-muted text-primary cursor-pointer"
                      >
                        <FaArrowRight />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Move to next one</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                  <span className="flex flex-row items-center justify-center gap-2">
                    <Tooltip>
                      <TooltipTrigger
                        type="button"
                        className="flex flex-row items-center justify-center p-2 h-10 w-10 rounded-full bg-muted/50 hover:bg-muted text-primary cursor-pointer"
                      >
                        <FaShuffle />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Shuffle the cards</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                </section>
              </main>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default page;
