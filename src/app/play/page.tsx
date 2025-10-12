"use client";

import Button from "@/components/shared/Button";
import { Button as Button2 } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaPlus,
  FaShuffle,
  FaWandMagicSparkles,
} from "react-icons/fa6";
import { GiHealthPotion, GiMagicPotion } from "react-icons/gi";
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
import { useRouter, useSearchParams } from "next/navigation";
import { CompoundCard, getCompoundCards } from "@/helper/idb";
import { toast } from "sonner";

interface GamifiedData {
  isCompleted: boolean;
  correctedCards: number[];
  currentCard: number;
  numberOfCards: number;
  healthLooseOnWrongByUser: number;
  healthLooseOnCorrectByMonster: number;
  maxUserHealth: number;
  currentUserHealth: number;
  userHealthAfterPotion: number;
  healthPotions: number;
  hintPotions: number;
  monsterMaxHealth: number;
  currentMonsterHealth: number;
}

function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const flashcardId = searchParams.get("flashcard");
  const [flashCardSet, setFlashCardSet] = useState<CompoundCard>();
  const [gamifiedData, setGamifiedData] = useState<GamifiedData>({
    isCompleted: false,
    correctedCards: [],
    currentCard: 1,
    numberOfCards: 0,
    healthLooseOnWrongByUser: 100,
    healthLooseOnCorrectByMonster: 100,
    maxUserHealth: 100,
    currentUserHealth: 100,
    userHealthAfterPotion: 100,
    healthPotions: 1,
    hintPotions: 3,
    monsterMaxHealth: 100,
    currentMonsterHealth: 100,
  });
  const [hint, setHint] = useState(0);

  useEffect(() => {
    const getFlashcardSet = async () => {
      const response = await getCompoundCards();

      const randomFlashcard = () => {
        const randomIdx = Math.floor(Math.random() * response.length);
        const id = response[randomIdx]?.id;
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("flashcard", id || "");
        window.history.replaceState({}, "", newUrl.toString());
        setFlashCardSet(response[randomIdx]);
        setGamifiedData({
          isCompleted: false,
          correctedCards: [],
          currentCard: 1,
          numberOfCards: response[randomIdx]?.cards.length || 0,
          healthLooseOnWrongByUser:
            100 / (response[randomIdx]?.cards.length / 2 || 1),
          healthLooseOnCorrectByMonster:
            100 / (response[randomIdx]?.cards.length || 1),
          maxUserHealth: 100,
          currentUserHealth: 100,
          userHealthAfterPotion: Math.min(100 + 30, 100),
          healthPotions: 1,
          hintPotions: 3,
          monsterMaxHealth: 100,
          currentMonsterHealth: 100,
        });
      };

      if (!response[0]?.id) {
        toast.error("No flashcard set found, please create one first");
        router.push("/create");
        return response;
      }

      if (!flashcardId) {
        randomFlashcard();
      } else {
        const cardSet = response.find((set) => set.id === flashcardId);
        if (cardSet) {
          setFlashCardSet(cardSet);
          setGamifiedData({
            isCompleted: false,
            correctedCards: [],
            currentCard: 1,
            numberOfCards: cardSet?.cards.length || 0,
            healthLooseOnWrongByUser: 100 / (cardSet?.cards.length / 2 || 1),
            healthLooseOnCorrectByMonster: 100 / (cardSet?.cards.length || 1),
            maxUserHealth: 100,
            currentUserHealth: 100,
            userHealthAfterPotion: Math.min(100 + 30, 100),
            healthPotions: 1,
            hintPotions: 3,
            monsterMaxHealth: 100,
            currentMonsterHealth: 100,
          });
        } else {
          toast.error("Flashcard of that id not found so showing a random one");
          randomFlashcard();
        }
      }

      toast.info("You must defeat the monster to obtain coins!");

      return response;
    };

    getFlashcardSet();

    return () => {};
  }, [flashcardId]);

  const handleHint = () => {
    setHint(gamifiedData?.currentCard || 1);
    if (hint != gamifiedData?.currentCard) {
      setGamifiedData((prev) => ({
        ...prev,
        hintPotions: Math.max(prev.hintPotions - 1, 0),
      }));
    }
  };

  // I used my entire brain cell but still couldn't figure out so used AI here
  const handleShuffle = () => {
    setFlashCardSet((prev) => {
      if (!prev) return prev;

      const cardsCopy = [...prev.cards];

      const uncompletedIndices = cardsCopy
        .map((_, idx) => idx)
        .filter((idx) => !gamifiedData.correctedCards.includes(idx + 1));

      const uncompletedCards = uncompletedIndices.map((idx) => cardsCopy[idx]);

      for (let i = uncompletedCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [uncompletedCards[i], uncompletedCards[j]] = [
          uncompletedCards[j],
          uncompletedCards[i],
        ];
      }

      uncompletedIndices.forEach((originalIdx, shuffledIdx) => {
        cardsCopy[originalIdx] = uncompletedCards[shuffledIdx];
      });

      setGamifiedData((prevData) => ({
        ...prevData,
        currentCard: 1,
      }));

      return { ...prev, cards: cardsCopy };
    });
  };

  const getMappableOptions = () => {
    if (!flashCardSet || gamifiedData.currentCard > gamifiedData.numberOfCards)
      return [];
    const option = [
      ...flashCardSet.cards[gamifiedData.currentCard - 1]?.options,
      flashCardSet.cards[gamifiedData.currentCard - 1]?.term,
    ];
    return option.sort(() => Math.random() - 0.5);
  };

  // I used my entire brain cell but still couldn't figure out so used AI here
  const getNextCurrentCard = () => {
    if (!flashCardSet) return gamifiedData.currentCard;

    const nextCard = gamifiedData.currentCard + 1;

    if (nextCard <= gamifiedData.numberOfCards) {
      return nextCard;
    }

    const uncompletedCards = flashCardSet.cards
      .map((_, idx) => idx + 1)
      .filter((idx) => !gamifiedData.correctedCards.includes(idx));

    if (uncompletedCards.length > 0) {
      return uncompletedCards[0];
    }

    setGamifiedData((prev) => ({
      ...prev,
      isCompleted: true,
    }));
    return gamifiedData.currentCard;
  };

  const handleOptionClick = (option: string) => {
    if (!flashCardSet) return;

    const correctAnswer =
      flashCardSet.cards[gamifiedData.currentCard - 1]?.term;

    if (option.toLowerCase() === correctAnswer.toLowerCase()) {
      const newMonsterHealth = Math.max(
        gamifiedData.currentMonsterHealth -
          gamifiedData.healthLooseOnCorrectByMonster,
        0
      );
      setGamifiedData((prev) => ({
        ...prev,
        isCompleted:
          prev.correctedCards.length + 1 === prev.numberOfCards &&
          newMonsterHealth <= 0,
        correctedCards: [...prev.correctedCards, prev.currentCard],
        currentCard: getNextCurrentCard(),
        currentMonsterHealth: newMonsterHealth,
      }));

      if (gamifiedData.correctedCards.length + 1 > gamifiedData.numberOfCards) {
        toast.success("Congratulations! You've defeated the monster!");
      } else {
        toast.success("Correct! You hit the monster!");
      }
    } else {
      const newUserHealth = Math.max(
        gamifiedData.currentUserHealth - gamifiedData.healthLooseOnWrongByUser,
        0
      );

      setGamifiedData((prev) => ({
        ...prev,
        isCompleted:
          prev.correctedCards.length === prev.numberOfCards &&
          prev.currentMonsterHealth <= 0,
        userHealthAfterPotion: Math.min(newUserHealth + 30, prev.maxUserHealth),
        currentUserHealth: newUserHealth,
      }));

      toast.error(
        `Wrong! You got hurt! Try to use potion to recover your self`
      );
    }
  };

  if (!flashCardSet?.id) {
    return (
      <div className="h-[calc(100vh-64px)] w-full flex flex-row items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <main className="flex flex-row items-center justify-center h-[calc(100vh-64px)] w-full px-4">
        <section className="h-full w-4/5">
          <header className="flex flex-row items-center justify-between h-16 w-full border-b">
            <h2 className="text-3xl">Flashcards</h2>
            <div className="flex flex-col items-center justify-center gap-2">
              <span>
                {gamifiedData?.currentCard || 1} /{" "}
                {gamifiedData?.numberOfCards || 1}
              </span>
              <span>Set of {flashCardSet?.idea}</span>
            </div>
            <div className="flex flex-row items-center justify-center gap-8">
              <Button type="button" title="Turn these into Quiz"></Button>
              <div className="flex flex-row items-center justify-center gap-2">
                <span className="flex flex-row items-center justify-center gap-1">
                  <GiHealthPotion /> {gamifiedData?.healthPotions ?? 1}
                </span>
                <span className="flex flex-row items-center justify-center gap-1">
                  <GiMagicPotion /> {gamifiedData?.hintPotions ?? 3}
                </span>
              </div>
            </div>
          </header>
          <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-128px)]">
            <div className="flex flex-row items-center justify-between w-full h-full gap-4">
              {/* Flashcard content ought to be here */}
              {flashCardSet?.cards.length && !gamifiedData?.isCompleted ? (
                <main className="flex flex-col items-start justify-start w-5/8 h-full">
                  <section className="aspect-[16/8] w-full bg-primary text-white rounded-2xl mx-4 mt-4 px-4 flex flex-col items-start justify-start relative overflow-hidden">
                    <header
                      style={{ zIndex: 10 }}
                      className="w-full flex flex-row items-center justify-between absolute top-4 left-0 px-6"
                    >
                      <span className="flex flex-row items-center justify-center gap-2">
                        <Popover>
                          <PopoverTrigger>
                            <Tooltip>
                              <TooltipTrigger type="button">
                                <FaWandMagicSparkles className="text-xl" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Get a Hint</p>
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
                                  Are you sure you want to spend 1 Hint potion
                                  to get a hint
                                </p>
                              </div>
                              <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <Button
                                    onClick={() => handleHint()}
                                    type="button"
                                    title="Confirm"
                                  ></Button>
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <span
                          className={
                            hint === gamifiedData.currentCard
                              ? "flex flex-row items-center justify-center"
                              : "sr-only"
                          }
                        >
                          {
                            flashCardSet.cards[gamifiedData?.currentCard - 1]
                              ?.hint
                          }
                        </span>
                      </span>
                      <span className="flex flex-row items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <AiFillSound className="text-xl" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Listen to the sound</p>
                          </TooltipContent>
                        </Tooltip>
                      </span>
                    </header>
                    <div className="h-full w-full flex flex-row items-center justify-center">
                      <span style={{ zIndex: 10 }} className="text-4xl">
                        {
                          flashCardSet.cards[gamifiedData?.currentCard - 1]
                            ?.definition
                        }
                      </span>
                      <Image
                        src={
                          flashCardSet.cards[gamifiedData?.currentCard - 1]
                            ?.src || "/nexora.svg"
                        }
                        alt={
                          flashCardSet.cards[gamifiedData?.currentCard - 1]
                            ?.alt || "Flashcard Image"
                        }
                        layout="fill"
                        objectFit="cover"
                        style={{
                          opacity: 0.2,
                        }}
                      />
                    </div>
                  </section>
                  <section className="w-full mx-4 p-4 flex flex-row items-center justify-between rounded-xl">
                    <span className="flex flex-row items-center gap-2">
                      <span className="text-lg">HP</span>
                      <div className="h-6 w-24 rounded overflow-hidden border-2 border-gray-700 shadow-inner relative">
                        <div
                          className="h-full bg-primary/60 transition-all duration-300 absolute top-0 left-0"
                          style={{
                            width:
                              gamifiedData?.currentUserHealth.toFixed(2) + "%",
                          }}
                        ></div>
                        <div
                          className="h-full bg-primary/5 transition-all duration-300 absolute top-0 left-0"
                          style={{
                            width:
                              gamifiedData?.userHealthAfterPotion.toFixed(2) +
                              "%",
                          }}
                        ></div>
                        <span
                          className="absolute inset-0 flex items-center justify-center text-[#2A2A2A]"
                          style={{ zIndex: 20 }}
                        >
                          {gamifiedData?.currentUserHealth.toFixed(2)}%
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
                                  <Button
                                    type="button"
                                    title="Confirm"
                                  ></Button>
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
                          onClick={() =>
                            setGamifiedData((prev) => ({
                              ...prev,
                              currentCard: prev.currentCard - 1,
                            }))
                          }
                          disabled={gamifiedData.currentCard <= 1}
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
                          onClick={() =>
                            setGamifiedData((prev) => ({
                              ...prev,
                              currentCard: getNextCurrentCard(),
                            }))
                          }
                          disabled={
                            gamifiedData.currentCard >=
                            gamifiedData.numberOfCards
                          }
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
                          onClick={() => handleShuffle()}
                        >
                          <FaShuffle />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Shuffle the cards</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </section>
                  <section className="w-full mx-4 p-4 flex flex-row items-center justify-between">
                    {gamifiedData?.correctedCards.includes(
                      gamifiedData?.currentCard
                    ) ? (
                      <>
                        <span className="text-xl text-primary">
                          You had completed this card
                        </span>
                      </>
                    ) : (
                      <>
                        {getMappableOptions()?.map((option, idx) => {
                          return (
                            <Button2
                              onClick={() => handleOptionClick(option)}
                              key={idx}
                            >
                              {option}
                            </Button2>
                          );
                        })}
                      </>
                    )}
                  </section>
                </main>
              ) : null}

              <main className="flex flex-col items-start justify-start w-3/8 h-full">
                <section className="h-full w-full text-white rounded-2xl m-4 px-4 flex flex-col items-start justify-start relative overflow-hidden">
                  <div className="h-full w-full flex flex-row items-center justify-center">
                    <Image
                      src="/standing.gif"
                      alt="Monster Image"
                      layout="fill"
                      objectFit="cover"
                      style={{
                        transform: "scaleX(-1)",
                      }}
                    />
                  </div>
                </section>
                <section className="w-full m-4 p-4 flex flex-row items-center justify-center rounded-xl">
                  <span className="flex flex-row items-center justify-center gap-2">
                    <span className="text-lg">HP</span>
                    <div className="h-6 w-24 rounded overflow-hidden border-2 border-gray-700 shadow-inner relative">
                      <div
                        className="h-full bg-destructive/60 transition-all duration-300 absolute top-0 left-0"
                        style={{
                          width:
                            gamifiedData?.currentMonsterHealth.toFixed(2) + "%",
                        }}
                      ></div>
                      <span
                        className="absolute inset-0 flex items-center justify-center text-[#2A2A2A]"
                        style={{ zIndex: 20 }}
                      >
                        {gamifiedData?.currentMonsterHealth.toFixed(2)}%
                      </span>
                    </div>
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

export default Page;
