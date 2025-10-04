"use client";

import Button from "@/components/shared/Button";
import InputField from "@/components/shared/InputField";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoCard, IoColorFill } from "react-icons/io5";
import { AiFillAudio } from "react-icons/ai";
import { MdOutlineTitle, MdSubtitles } from "react-icons/md";
import {
  FaFileImport,
  FaFont,
  FaImage,
  FaKeyboard,
  FaPlus,
  FaTrash,
  FaWandMagicSparkles,
} from "react-icons/fa6";
import { IoMdSwap } from "react-icons/io";
import React, { useState } from "react";
import { Card, Cardset } from "@/types/cards";
import { defaultCardSetDataList } from "@/config";
import { FaGripHorizontal } from "react-icons/fa";

function Page() {
  const [cardSetData, setCardSetData] = useState<Cardset>({
    idea: "",
    description: "",
  });

  const [cardSetDataList, setCardSetDataList] = useState<Card[]>(
    defaultCardSetDataList
  );

  const handleChange = (value: string, field: "idea" | "description") => {
    setCardSetData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <main className="flex flex-row items-center justify-center w-full py-16 px-4">
      <section className="flex flex-col items-center  w-4/5 h-full gap-6">
        <header className="flex flex-row items-center justify-between sticky top-16 z-10 bg-background h-16 w-full border-b">
          <h2 className="text-3xl">Create a new flashcard set</h2>
          <div className="flex flex-row items-center justify-center gap-4">
            <Button leftIcon={<FaFileImport />} title="Import"></Button>
            <Button leftIcon={<FaPlus />} title="Create"></Button>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center w-full">
          <InputField
            icon={<MdOutlineTitle />}
            name="idea"
            type="text"
            placeholder="Enter set idea"
            value={cardSetData.idea}
            onChange={(value) => handleChange(value, "idea")}
          />
          <InputField
            icon={<MdSubtitles />}
            name="description"
            type="text"
            placeholder="Add a description..."
            value={cardSetData.description}
            onChange={(value) => handleChange(value, "description")}
          />
        </div>
        <div className="flex flex-row items-center justify-between w-full gap-4">
          <div className="flex flex-row items-center justify-center gap-4">
            <Button leftIcon={<IoCard />} title="Practice Flashcard"></Button>
          </div>
          <div className="flex flex-row items-center justify-center gap-4">
            <span className="flex flex-row items-center justify-center gap-2">
              Suggestions <Switch className="cursor-pointer" />
            </span>
            <Tooltip>
              <TooltipTrigger className="flex flex-row items-center justify-center p-2 h-10 w-10 rounded-full bg-muted/50 hover:bg-muted text-primary cursor-pointer">
                <FaKeyboard />
              </TooltipTrigger>
              <TooltipContent>
                <p>See Shortcuts</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger className="flex flex-row items-center justify-center p-2 h-10 w-10 rounded-full bg-muted/50 hover:bg-muted text-primary cursor-pointer">
                <FaWandMagicSparkles />
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate with AI</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger className="flex flex-row items-center justify-center p-2 h-10 w-10 rounded-full bg-muted/50 hover:bg-muted text-primary cursor-pointer">
                <IoMdSwap />
              </TooltipTrigger>
              <TooltipContent>
                <p>Flip terms and definition</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {cardSetDataList.map((card, index, cardList) => {
          return (
            <>
              <section className="flex flex-col items-center w-full overflow-y-auto gap-6 pb-6 bg-slate-300 rounded">
                <div className="flex flex-row justify-between items-center w-full py-2 px-4">
                  <div className="text-xl font-bold">{index + 1}</div>
                  <div className="flex flex-row items-center justify-center px-4 py-1 gap-2 bg-background/60 rounded-2xl">
                    <span className="rounded-sm cursor-pointer hover:bg-background/30 p-1 transition-all duration-300">
                      <FaFont />
                    </span>
                    <span className="rounded-sm cursor-pointer hover:bg-background/30 p-1 transition-all duration-300">
                      <IoColorFill />
                    </span>
                    <span className="rounded-sm cursor-pointer hover:bg-background/30 p-1 transition-all duration-300">
                      <AiFillAudio />
                    </span>
                  </div>
                  <div className="flex flex-row items-center justify-center py-1 gap-4">
                    <span className="rounded-sm cursor-grab hover:bg-background/30 p-1 transition-all duration-300">
                      <FaGripHorizontal />
                    </span>
                    <span className="rounded-sm cursor-pointer hover:bg-background/30 p-1 transition-all duration-300">
                      <FaTrash />
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between w-full gap-4 px-4">
                  <InputField
                    icon={<MdOutlineTitle />}
                    name="term"
                    type="text"
                    placeholder="Enter term"
                  />
                  <InputField
                    icon={<MdSubtitles />}
                    name="definition"
                    type="text"
                    placeholder="Enter definition"
                  />
                  <div className="h-16 w-16 p-4 border-2 border-dotted flex flex-col items-center justify-center rounded cursor-pointer hover:text-blue-800 transition-all duration-300">
                    <FaImage />
                    <span className="text-xs">Image</span>
                  </div>
                </div>
              </section>
            </>
          );
        })}
        
      </section>
    </main>
  );
}

export default Page;
