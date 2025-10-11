"use client";

import Button from "@/components/shared/Button";
import React from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";
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
            <div className="flex flex-col items-start justify-start w-full h-full">
              <main className="aspect-video w-5/8 rounded-2xl m-4 px-4 flex flex-col items-start justify-start relative">
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
              </main>
              <section className="w-5/8 h-full m-4 px-4 flex flex-col items-center justify-center">
              
              </section>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default page;
