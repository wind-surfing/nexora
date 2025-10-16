"use client";

import Button from "@/components/shared/Button";
import InputField from "@/components/shared/InputField";
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
  FaFileExport,
  FaFont,
  FaKeyboard,
  FaLightbulb,
  FaPlus,
  FaSpinner,
  FaTrash,
  FaWandMagicSparkles,
} from "react-icons/fa6";
import { GiChoice } from "react-icons/gi";
import { IoMdSwap } from "react-icons/io";
import React, { useState } from "react";
import { Card, Cardset, CompoundCard } from "@/types/cards";
import {
  createShortcuts,
  defaultCardSetDataList,
  singleCardSetData,
} from "@/config";
import Dropzone from "@/components/ImageDropzone";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { toast } from "sonner";
import {
  getAllImages,
  storeCompoundCard,
  updateCurrentUser,
} from "@/helper/idb";
import { useRouter } from "next/navigation";
import createFlashcards from "@/lib/generateFlashcards";
import createFlashcard from "@/lib/generateFlashcard";
import FileDropzone from "@/components/FileDropzone";
import { useShortcuts } from "@/hooks/useShortcuts";
import { useUser } from "@/context/UserContext";

function Page() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [cardSetData, setCardSetData] = useState<Cardset>({
    idea: "",
    description: "",
  });
  const [mainLoading, setMainLoading] = useState(false);
  const [secondaryLoading, setSecondaryLoading] = useState<number>(0);

  const [cardSetDataList, setCardSetDataList] = useState<Card[]>(
    defaultCardSetDataList
  );

  const handleChange = (value: string, field: "idea" | "description") => {
    setCardSetData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (cardSetData.idea.trim() === "") {
      toast.error("Set idea cannot be empty!");
      return;
    }
    if (cardSetData.description.trim() === "") {
      toast.error("Set description cannot be empty!");
      return;
    }

    const compoundCard: CompoundCard = {
      idea: cardSetData.idea,
      description: cardSetData.description,
      cards: cardSetDataList,
    };

    if (compoundCard.cards.length === 0) {
      toast.error("Add at least one card!");
      return;
    } else {
      try {
        await storeCompoundCard(compoundCard);
        toast.success("Flashcard set created!");
        router.push("/home");
      } catch (error) {
        toast.error("Failed to create flashcard set");
      }
    }
  };

  const handleGenerateFlashcards = async (
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    e?.preventDefault();
    setMainLoading(true);

    const images = await getAllImages(-1, "path");

    if (cardSetData.idea.trim() === "") {
      toast.error("Set idea cannot be empty!");
      setMainLoading(false);
      return;
    }
    if (cardSetData.description.trim() === "") {
      toast.error("Set description cannot be empty!");
      setMainLoading(false);
      return;
    }

    if (user.nexoins < 120) {
      toast.error("You donot have enough nexoins to generate flashcards");
      setMainLoading(false);
      return;
    }

    try {
      const response = await createFlashcards(images, cardSetData);
      if (response) {
        setCardSetDataList((prev) => [...prev, ...response]);
        updateUser({ nexoins: user.nexoins - 120 });
      } else {
        toast.error("Failed to get flashcards");
      }

      toast.success("Flashcards generated!");
    } catch (error) {
      toast.error("Failed to generate flashcards");
    } finally {
      setMainLoading(false);
    }
  };

  const handleGenerateFlashcard = async (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    setSecondaryLoading(index + 1);

    const images = await getAllImages(-1, "path");

    if (cardSetData.idea.trim() === "") {
      toast.error("Set idea cannot be empty!");
      setSecondaryLoading(0);
      return;
    }
    if (cardSetData.description.trim() === "") {
      toast.error("Set description cannot be empty!");
      setSecondaryLoading(0);
      return;
    }

    const contentCard = cardSetDataList[index];
    const subContents = cardSetDataList
      .filter((_, i) => i !== index)
      .filter((card) => card.term && card.definition);

    if (user.nexoins < 120) {
      toast.error("You donot have enough nexoins to generate flashcards");
      setSecondaryLoading(0);
      return;
    }

    try {
      const response = await createFlashcard(images, cardSetData, {
        examples: subContents,
        content: contentCard,
      });

      if (response) {
        setCardSetDataList((prev) => {
          const newArray = [...prev];
          newArray[index] = response;
          return newArray;
        });
        updateUser({ nexoins: user.nexoins - 120 });
      } else {
        toast.error("Failed to get flashcards");
      }

      toast.success("Flashcards generated!");
    } catch (error) {
      toast.error("Failed to generate flashcard");
    } finally {
      setSecondaryLoading(0);
    }
  };

  const handleImport = async (file: File) => {
    if (!file) {
      toast.error("No file selected");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const jsonString = event.target?.result as string;
        const jsonObject = JSON.parse(jsonString) as CompoundCard;
        if (!jsonObject.idea || !jsonObject.description || !jsonObject.cards) {
          toast.error("Invalid flashcard set format");
          return;
        }
        if (jsonObject.idea && jsonObject.description) {
          setCardSetData({
            idea: jsonObject.idea,
            description: jsonObject.description,
          });
        }
        if (jsonObject.cards.length > 0) {
          setCardSetDataList((prev) => [...prev, ...jsonObject.cards]);
        }

        toast.success("Flashcard set imported!");
      } catch (error) {
        toast.error("Failed to read file");
      }
    };

    reader.readAsText(file);
  };

  const handleExport = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();

    const compoundCard: CompoundCard = {
      idea: cardSetData.idea,
      description: cardSetData.description,
      cards: cardSetDataList,
    };

    const blob = new Blob([JSON.stringify(compoundCard)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${cardSetData.idea || "flashcard-set"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Flashcard set exported!");
  };

  const shortcuts = createShortcuts({
    onImport: () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          handleImport(file);
        }
      };
      input.click();
    },
    onExport: () => handleExport(),
    onGenerateAI: () => handleGenerateFlashcards(),
    onFlip: () =>
      setCardSetDataList((prev) =>
        prev.map((card) => ({
          ...card,
          term: card.definition,
          definition: card.term,
        }))
      ),
    onAdd: () => setCardSetDataList((prev) => [...prev, singleCardSetData]),
    onSave: () => handleSubmit(),
    onClear: () =>
      setCardSetDataList((prev) =>
        prev.map(() => ({
          term: "",
          definition: "",
          src: "",
          alt: "",
          options: ["", "", ""],
          hint: "",
          theme: "",
          category: "",
        }))
      ),
  });

  useShortcuts(shortcuts);

  return (
    <main className="flex flex-row items-center justify-center w-full py-8 px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-4/5 h-full gap-6"
      >
        <header className="flex flex-row items-center justify-between sticky top-16 z-20 bg-background h-16 w-full border-b">
          <h2 className="text-3xl">Create a new flashcard set</h2>
          <div className="flex flex-row items-center justify-center gap-4">
            <FileDropzone onChange={(file) => handleImport(file)} />
            <Button
              onClick={handleExport}
              leftIcon={<FaFileExport />}
              type="button"
              title="Export"
            ></Button>
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
            <Button
              type="button"
              leftIcon={<IoCard />}
              title="Practice Flashcard"
            ></Button>
          </div>
          <div className="flex flex-row items-center justify-center gap-4">
            <Menubar className="border-none shadow-none">
              <MenubarMenu>
                <MenubarTrigger className="flex flex-row items-center justify-center p-2 h-10 w-10 rounded-full bg-muted/50 hover:bg-muted text-primary cursor-pointer">
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <FaKeyboard />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>See Shortcuts</p>
                    </TooltipContent>
                  </Tooltip>
                </MenubarTrigger>
                <MenubarContent>
                  {shortcuts.map((shortcut) => (
                    <MenubarSub key={shortcut.category}>
                      <MenubarSubTrigger>{shortcut.category}</MenubarSubTrigger>
                      <MenubarSubContent>
                        {shortcut.shorts.map((s) => (
                          <MenubarItem key={s.key}>
                            {s.action}
                            <MenubarShortcut key={s.key}>
                              {s.key}
                            </MenubarShortcut>
                          </MenubarItem>
                        ))}
                      </MenubarSubContent>
                    </MenubarSub>
                  ))}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>

            <Popover>
              <PopoverTrigger className="flex flex-row items-center justify-center p-2 h-10 w-10 rounded-full bg-muted/50 hover:bg-muted text-primary cursor-pointer">
                <Tooltip>
                  <TooltipTrigger type="button">
                    {mainLoading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaWandMagicSparkles />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Generate with AI</p>
                  </TooltipContent>
                </Tooltip>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="leading-none font-medium">Confirm</h4>
                    <p className="text-muted-foreground text-sm">
                      Are you sure you want to spend 120 nexoins to generate
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Button
                        type="button"
                        onClick={(e) => handleGenerateFlashcards(e)}
                        title="Confirm"
                      ></Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Tooltip>
              <TooltipTrigger
                type="button"
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
                <section
                  key={index}
                  className="flex flex-col items-center w-full overflow-y-auto gap-6 bg-slate-300 rounded"
                >
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
                                  value={card.alt}
                                  onChange={({ target: { value } }) =>
                                    setCardSetDataList((prev) => {
                                      const newArray = [...prev];
                                      newArray[index].alt = value;
                                      return newArray;
                                    })
                                  }
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
                                  value={card.hint}
                                  onChange={({ target: { value } }) =>
                                    setCardSetDataList((prev) => {
                                      const newArray = [...prev];
                                      newArray[index].hint = value;
                                      return newArray;
                                    })
                                  }
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
                                  value={card.options[0]}
                                  onChange={({ target: { value } }) =>
                                    setCardSetDataList((prev) => {
                                      const newArray = [...prev];
                                      newArray[index].options[0] = value;
                                      return newArray;
                                    })
                                  }
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="option-2">Option 2</Label>
                                <Input
                                  id="option-2"
                                  type="text"
                                  className="col-span-2 h-8"
                                  value={card.options[1]}
                                  onChange={({ target: { value } }) =>
                                    setCardSetDataList((prev) => {
                                      const newArray = [...prev];
                                      newArray[index].options[1] = value;
                                      return newArray;
                                    })
                                  }
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="option-3">Option 3</Label>
                                <Input
                                  id="option-3"
                                  type="text"
                                  className="col-span-2 h-8"
                                  value={card.options[2]}
                                  onChange={({ target: { value } }) =>
                                    setCardSetDataList((prev) => {
                                      const newArray = [...prev];
                                      newArray[index].options[2] = value;
                                      return newArray;
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger className="rounded-sm cursor-pointer hover:bg-background/30 p-1 transition-all duration-300">
                          <IoColorFill color={card.theme} />
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
                                  value={card.theme}
                                  onChange={({ target: { value } }) =>
                                    setCardSetDataList((prev) => {
                                      const newArray = [...prev];
                                      newArray[index].theme = value;
                                      return newArray;
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger className="rounded-sm cursor-pointer hover:bg-background/30 p-1 transition-all duration-300">
                          <Tooltip>
                            <TooltipTrigger type="button">
                              {secondaryLoading === index + 1 ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                <FaWandMagicSparkles />
                              )}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Generate with AI</p>
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
                                Are you sure you want to spend 120 nexoins to
                                generate
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Button
                                  type="button"
                                  onClick={(e) =>
                                    handleGenerateFlashcard(e, index)
                                  }
                                  title="Confirm"
                                ></Button>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
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
                    <Dropzone
                      data={[card.src]}
                      onChange={(url) =>
                        setCardSetDataList((prev) => {
                          const newArray = [...prev];
                          newArray[index].src = url;
                          return newArray;
                        })
                      }
                      uploadType="single"
                    ></Dropzone>
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
            type="button"
            onClick={() =>
              setCardSetDataList((prev) => [...prev, singleCardSetData])
            }
            title="Add a Card"
          ></Button>
        </div>

        <div className="flex flex-row ml-auto gap-4">
          <Button
            type="button"
            onClick={() =>
              setCardSetDataList((prev) =>
                prev.map(() => ({
                  term: "",
                  definition: "",
                  src: "",
                  alt: "",
                  options: ["", "", ""],
                  hint: "",
                  theme: "",
                  category: "",
                }))
              )
            }
            title="Clear"
          ></Button>
          <Button type="submit" title="Create"></Button>
        </div>
      </form>
    </main>
  );
}

export default Page;
