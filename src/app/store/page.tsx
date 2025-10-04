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
import { MdOutlineTitle, MdSubtitles } from "react-icons/md";
import {
  FaArrowDown,
  FaArrowUp,
  FaFileImport,
  FaFont,
  FaKeyboard,
  FaLightbulb,
  FaPlus,
  FaTrash,
  FaWandMagicSparkles,
} from "react-icons/fa6";
import { GiChoice } from "react-icons/gi";
import { IoMdSwap } from "react-icons/io";
import React, { useState } from "react";
import { Card, Cardset } from "@/types/cards";
import { defaultCardSetDataList, singleCardSetData } from "@/config";
import Dropzone from "@/components/ImageDropzone";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
        <header className="flex flex-row items-center justify-between sticky top-16 z-20 bg-background h-16 w-full border-b">
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
              <TooltipTrigger
                onClick={() => {
                  setCardSetDataList((prev) =>
                    prev.map((card) => ({
                      ...card,
                      term: card.definition,
                      definition: card.term,
                    }))
                  );
                }}
                className="flex flex-row items-center justify-center p-2 h-10 w-10 rounded-full bg-muted/50 hover:bg-muted text-primary cursor-pointer"
              >
                <IoMdSwap />
              </TooltipTrigger>
              <TooltipContent>
                <p>Flip terms and definition</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full">
          {cardSetDataList.map((card, index, cardList) => {
            return (
              <>
                <section className="flex flex-col items-center w-full overflow-y-auto gap-6 bg-slate-300 rounded">
                  <div className="flex flex-row justify-between items-center w-full py-2 px-4">
                    <div className="text-xl font-bold">{index + 1}</div>
                    <div className="flex flex-row items-center justify-center px-4 py-1 gap-2 bg-background/60 rounded-2xl">
                      <Popover>
                        <PopoverTrigger className="rounded-sm cursor-pointer hover:bg-background/30 p-1 transition-all duration-300">
                          <FaFont />
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="leading-none font-medium">ALT</h4>
                              <p className="text-muted-foreground text-sm">
                                Provide a description for the image.
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="alt">Alt</Label>
                                <Input
                                  id="alt"
                                  type="text"
                                  className="col-span-2 h-8"
                                />
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger className="rounded-sm cursor-pointer hover:bg-background/30 p-1 transition-all duration-300">
                          <FaLightbulb />
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="leading-none font-medium">Hint</h4>
                              <p className="text-muted-foreground text-sm">
                                Provide a hint for the card.
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="hint">Hint</Label>
                                <Input
                                  id="hint"
                                  type="text"
                                  className="col-span-2 h-8"
                                />
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger className="rounded-sm cursor-pointer hover:bg-background/30 p-1 transition-all duration-300">
                          <GiChoice />
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="leading-none font-medium">
                                Options
                              </h4>
                              <p className="text-muted-foreground text-sm">
                                Provide options for the card definition.
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="option-1">Option 1</Label>
                                <Input
                                  id="option-1"
                                  type="text"
                                  className="col-span-2 h-8"
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="option-2">Option 2</Label>
                                <Input
                                  id="option-2"
                                  type="text"
                                  className="col-span-2 h-8"
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="option-3">Option 3</Label>
                                <Input
                                  id="option-3"
                                  type="text"
                                  className="col-span-2 h-8"
                                />
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger className="rounded-sm cursor-pointer hover:bg-background/30 p-1 transition-all duration-300">
                          <IoColorFill />
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="leading-none font-medium">
                                Theme
                              </h4>
                              <p className="text-muted-foreground text-sm">
                                Provide a theme for the card.
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="theme">Theme</Label>
                                <Input
                                  id="theme"
                                  type="color"
                                  className="col-span-2 h-8"
                                />
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <span className="rounded-sm cursor-pointer hover:bg-background/30 p-1 transition-all duration-300">
                        <FaWandMagicSparkles />
                      </span>
                    </div>
                    <div className="flex flex-row items-center justify-center py-1 gap-4">
                      <span
                        onClick={() =>
                          setCardSetDataList((prev) => {
                            const newArray = [...prev];
                            newArray.splice(
                              index - 1,
                              0,
                              newArray.splice(index, 1)[0]
                            );
                            return newArray;
                          })
                        }
                        className="rounded-sm cursor-grab hover:bg-background/30 p-1 transition-all duration-300"
                      >
                        <FaArrowUp />
                      </span>
                      <span
                        onClick={() =>
                          setCardSetDataList((prev) => {
                            const newArray = [...prev];
                            newArray.splice(
                              index + 1,
                              0,
                              newArray.splice(index, 1)[0]
                            );
                            return newArray;
                          })
                        }
                        className="rounded-sm cursor-grab hover:bg-background/30 p-1 transition-all duration-300"
                      >
                        <FaArrowDown />
                      </span>
                      <span
                        onClick={() =>
                          setCardSetDataList(
                            cardList.filter((_, i) => i !== index)
                          )
                        }
                        className="rounded-sm cursor-pointer hover:bg-background/30 p-1 transition-all duration-300"
                      >
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
                      value={card.term}
                      onChange={(value) =>
                        setCardSetDataList((prev) => {
                          const newArray = [...prev];
                          newArray[index].term = value;
                          return newArray;
                        })
                      }
                    />
                    <InputField
                      icon={<MdSubtitles />}
                      name="definition"
                      type="text"
                      placeholder="Enter definition"
                      value={card.definition}
                      onChange={(value) =>
                        setCardSetDataList((prev) => {
                          const newArray = [...prev];
                          newArray[index].definition = value;
                          return newArray;
                        })
                      }
                    />
                    <Dropzone></Dropzone>
                  </div>
                </section>
                <div className="w-full h-6 flex flex-row items-center justify-center group">
                  <span
                    onClick={() =>
                      setCardSetDataList((prev) => {
                        const newArray = [...prev];
                        newArray.splice(index + 1, 0, singleCardSetData);
                        return newArray;
                      })
                    }
                    className="h-8 w-8 rounded-full bg-primary text-white border flex flex-row items-center justify-center cursor-pointer group-hover:scale-100 scale-0 transition-all duration-300"
                  >
                    <FaPlus></FaPlus>
                  </span>
                </div>
              </>
            );
          })}
        </div>

        <div className="flex flex-row items-center justify-center p-4">
          <Button
            onClick={() =>
              setCardSetDataList((prev) => [...prev, singleCardSetData])
            }
            title="Add a Card"
          ></Button>
        </div>

        <div className="flex flex-row ml-auto gap-4">
          <Button title="Clear"></Button>
          <Button title="Save"></Button>
        </div>
      </section>
    </main>
  );
}

export default Page;
