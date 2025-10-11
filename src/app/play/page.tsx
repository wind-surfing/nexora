"use client";

import Button from "@/components/shared/Button";
import React from "react";
import { GiHealthPotion, GiMagicPotion } from "react-icons/gi";

function page() {
  return (
    <>
      <main className="flex flex-row items-center justify-center w-full px-4">
        <section className="w-4/5">
          <header className="flex flex-row items-center justify-between sticky top-16 z-20 h-16 w-full border-b">
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
        </section>
      </main>
    </>
  );
}

export default page;
