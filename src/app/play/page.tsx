"use client";

import Button from "@/components/shared/Button";
import React from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaShuffle,
  FaWandMagicSparkles,
} from "react-icons/fa6";
import { GiHealthPotion, GiMagicPotion } from "react-icons/gi";
import { AiFillSound } from "react-icons/ai";

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
                <section className="aspect-video w-full bg-primary text-white rounded-2xl m-4 px-4 flex flex-col items-start justify-start relative">
                  <header className="w-full flex flex-row items-center justify-between absolute top-4 left-0 px-6">
                    <span className="flex flex-row items-center gap-2">
                      <FaWandMagicSparkles className="text-xl" />
                      <span className="sr-only">Hint Content</span>
                    </span>
                    <span className="flex flex-row items-center gap-2">
                      <AiFillSound className="text-xl" />
                    </span>
                  </header>
                  <div className="h-full w-full flex flex-row items-center justify-center">
                    <span className="text-4xl">Term / Question</span>
                  </div>
                </section>
                <section className="w-full m-4 p-4 flex flex-row items-center justify-between rounded-xl">
                  <span className="flex flex-row items-center gap-4">
                    <span className="text-lg">HP</span>
                    <div className="h-6 w-24 rounded overflow-hidden border-2 border-gray-700 shadow-inner relative">
                      <div
                        className="h-full bg-primary transition-all duration-300 absolute top-0 left-0"
                        style={{ width: "100%" }}
                      ></div>
                      <span
                        className="absolute inset-0 flex items-center justify-center text-gray-300"
                        style={{ zIndex: 20 }}
                      >
                        100%
                      </span>
                    </div>
                  </span>
                  <span className="flex flex-row items-center gap-2">
                    <FaArrowLeft />
                    <FaArrowRight />
                  </span>
                  <span className="flex flex-row items-center gap-2">
                    <FaShuffle />
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
