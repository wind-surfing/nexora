"use client";

import Button from "@/components/shared/Button";
import InputField from "@/components/shared/InputField";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoCard } from "react-icons/io5";
import { MdOutlineTitle, MdSubtitles } from "react-icons/md";
import {
  FaFileImport,
  FaKeyboard,
  FaPlus,
  FaWandMagicSparkles,
} from "react-icons/fa6";
import { IoMdSwap } from "react-icons/io";
import React, { useState } from "react";
import { Card, Cardset } from "@/types/cards";

function Page() {
  const [cardSetData, setCardSetData] = useState<Cardset>({
    idea: "",
    description: "",
  });

  const [cardSetDataList, setCardSetDataList] = useState<Card[]>([]);

  const handleChange = (value: string, field: "idea" | "description") => {
    setCardSetData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <main className="flex flex-row items-center justify-center w-full h-[calc(100vh-76px)] px-4">
      <section className="flex flex-col items-center  w-4/5 h-full gap-6">
        <div className="flex flex-row items-center justify-between sticky top-16 w-full">
          <h2 className="text-3xl">Create a new flashcard set</h2>
          <div className="flex flex-row items-center justify-center gap-4">
            <Button leftIcon={<FaFileImport />} title="Import"></Button>
            <Button leftIcon={<FaPlus />} title="Create"></Button>
          </div>
        </div>
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
      </section>
    </main>
  );
}

export default Page;
