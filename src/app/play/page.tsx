"use client";

import "@/styles/fled-styles.css";
import Button from "@/components/shared/Button";
import { Button as Button2 } from "@/components/ui/button";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaPlus,
  FaShuffle,
  FaWandMagicSparkles,
} from "react-icons/fa6";
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
import { CompoundCard, getCompoundCards, getImageByPath } from "@/helper/idb";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import SignalWave from "@/components/SignalWave";
import Loader from "@/components/shared/Loader";
import { itemsList } from "@/config";
import { cn } from "@/lib/utils";

interface GamifiedData {
  isCompleted: boolean;
  correctedCards: number[];
  currentCard: number;
  numberOfCards: number;
  healthLooseOnWrongByUser: number;
  healthLooseOnCorrectByMonster: number;
  maxUserHealth: number;
  currentUserHealth: number;
  userHealthAfterHealthPotion: number;
  monsterMaxHealth: number;
  currentMonsterHealth: number;
}

interface EnemyState {
  src: string;
  alt: string;
  className: string;
  type: "permanent" | "temporary";
}

function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const flashcardId = searchParams.get("flashcard");
  const { user, updateUser } = useUser();
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);
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
    userHealthAfterHealthPotion: 100,
    monsterMaxHealth: 100,
    currentMonsterHealth: 100,
  });
  const [hint, setHint] = useState(0);
  const [enemyState, setEnemyState] = useState<EnemyState>({
    src: "/standing.gif",
    alt: "Standing",
    className: "",
    type: "temporary",
  });
  const [speechSignal, setSpeechSignal] = useState<"speaking" | "idle">("idle");
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    stopSpeechSignal();
  }, [gamifiedData.currentCard]);

  const handleEnemyState = (
    src: string,
    alt: string = src,
    className: string = "",
    type: "permanent" | "temporary" = "temporary"
  ) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setEnemyState((prev) => ({
      ...prev,
      src: `/${src}.gif`,
      alt: alt,
      className: className,
      type: type,
    }));

    if (type === "permanent") {
      timeoutRef.current = setTimeout(() => {
        router.push("/home");
      }, 3000);
    } else {
      timeoutRef.current = setTimeout(() => {
        setEnemyState({
          src: "/standing.gif",
          alt: "Standing",
          className: "",
          type: "temporary",
        });
      }, 3000);
    }
  };

  useEffect(() => {
    const getFlashcardSet = async () => {
      const response = await getCompoundCards();

      if (!response[0]?.id) {
        toast.error("No flashcard set found, please create one first");
        router.push("/create");
        return response;
      }

      const getUpdatedCardSetWithTheCorrectImagePaths = async (
        cardIdx: number
      ) => {
        if (response.length > 0) {
          const images = response[cardIdx].cards
            .map((card) => card.src)
            .filter((src) => src && src.trim() !== "")
            .filter((src) => src && src.startsWith("/**idb**/"));

          const usableImages = await Promise.all(
            images.map(async (src) => await getImageByPath(src, "dataUrl"))
          );
          const usableUrls = usableImages
            .map((image) => image?.url || "")
            .filter(
              (url) => url && typeof url === "string" && url.trim() !== ""
            );

          const updatedCards = response[cardIdx].cards.map((card, idx) => ({
            ...card,
            src: usableUrls[idx] as string,
          }));

          return {
            ...response[cardIdx],
            cards: updatedCards,
          };
        }
      };

      const randomFlashcard = async () => {
        const randomIdx = Math.floor(Math.random() * response.length);
        const updatedCardSet = await getUpdatedCardSetWithTheCorrectImagePaths(
          randomIdx
        );
        const id = response[randomIdx]?.id;
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("flashcard", id || "");
        window.history.replaceState({}, "", newUrl.toString());
        setFlashCardSet(updatedCardSet);
        setGamifiedData({
          isCompleted: false,
          correctedCards: [],
          currentCard: 1,
          numberOfCards: updatedCardSet?.cards.length || 0,
          healthLooseOnWrongByUser:
            100 / ((updatedCardSet?.cards.length || 1) / 2 || 1),
          healthLooseOnCorrectByMonster:
            100 / (updatedCardSet?.cards.length || 1),
          maxUserHealth: 100,
          currentUserHealth: 100,
          userHealthAfterHealthPotion: Math.min(100 + 30, 100),
          monsterMaxHealth: 100,
          currentMonsterHealth: 100,
        });
      };

      if (!flashcardId) {
        randomFlashcard();
      } else {
        const cardSet = response.find((set) => set.id === flashcardId);
        const updatedCardSet = await getUpdatedCardSetWithTheCorrectImagePaths(
          response.indexOf(cardSet!)
        );
        if (updatedCardSet) {
          setFlashCardSet(updatedCardSet);
          setGamifiedData({
            isCompleted: false,
            correctedCards: [],
            currentCard: 1,
            numberOfCards: updatedCardSet?.cards.length || 0,
            healthLooseOnWrongByUser:
              100 / ((updatedCardSet?.cards.length || 1) / 2 || 1),
            healthLooseOnCorrectByMonster:
              100 / (updatedCardSet?.cards.length || 1),
            maxUserHealth: 100,
            currentUserHealth: 100,
            userHealthAfterHealthPotion: Math.min(100 + 30, 100),
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
  }, [flashcardId, router]);

  const handleHint = () => {
    if (hint != gamifiedData?.currentCard) {
      if ((user.ownedItems.hint || 0) > 0) {
        setHint(gamifiedData?.currentCard || 1);
        updateUser({
          ownedItems: {
            ...user.ownedItems,
            hint: Math.max(user.ownedItems.hint - 1, 0),
          },
        });
      } else {
        toast.error("You don't have enough hint potions");
      }
    }
  };

  const getSpeechSignal = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Speech Synthesis not supported in this browser.");
      return;
    }

    stopSpeechSignal();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeechSignal("speaking");
    utterance.onend = () => setSpeechSignal("idle");

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeechSignal = () => {
    window.speechSynthesis.cancel();
    setSpeechSignal("idle");
  };

  const handleHealth = () => {
    if ((user.ownedItems.health || 0) > 0) {
      setGamifiedData((prev) => ({
        ...prev,
        currentUserHealth: Math.min(prev.currentUserHealth + 30, 100),
        userHealthAfterHealthPotion: Math.min(
          prev.userHealthAfterHealthPotion + 30,
          100
        ),
      }));
      updateUser({
        ownedItems: {
          ...user.ownedItems,
          health: Math.max(user.ownedItems.health - 1, 0),
        },
      });
    } else {
      toast.error("You don't have enough health potions");
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

  const mappableOptions = useMemo(() => {
    if (!flashCardSet || gamifiedData.currentCard > gamifiedData.numberOfCards)
      return [];

    const options = [
      ...flashCardSet.cards[gamifiedData.currentCard - 1]?.options,
      flashCardSet.cards[gamifiedData.currentCard - 1]?.term,
    ];

    return options.sort(() => Math.random() - 0.5);
  }, [flashCardSet, gamifiedData.currentCard, gamifiedData.numberOfCards]);

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

  const handleOptionClick = async (option: string) => {
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

      if (
        gamifiedData.correctedCards.length + 1 >=
        gamifiedData.numberOfCards
      ) {
        handleEnemyState("running", "Running", "fled", "permanent");
        try {
          updateUser({
            nexoins: user.nexoins + 60,
            currentSignalGauge: +(
              user.currentSignalGauge +
              1.5 * Math.log2(user.currentSignalLevel + 2)
            ).toFixed(2),
          });
          toast.info("You obtained 60 nexoins! & some signal gauge!");
        } catch (error) {
          toast.error("Please login to earn nexoins!");
        }
        toast.success("Congratulations! You've defeated the monster!");
        queueMicrotask(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        });
      } else {
        handleEnemyState("damaged", "Damaged");
        toast.success("Correct! You hit the monster!");
      }
    } else {
      const newUserHealth = Math.max(
        gamifiedData.currentUserHealth - gamifiedData.healthLooseOnWrongByUser,
        0
      );

      setGamifiedData((prev) => ({
        ...prev,
        isCompleted: newUserHealth <= 0,
        userHealthAfterHealthPotion: Math.min(
          newUserHealth + 30,
          prev.maxUserHealth
        ),
        currentUserHealth: newUserHealth,
      }));

      if (newUserHealth <= 0) {
        handleEnemyState("attacking", "Attacking", "victory", "permanent");
        if (user.nexoins < 50) {
          updateUser({
            nexoins: 0,
            currentSignalGauge: 0,
            currentSignalLevel: Math.max(user.currentSignalLevel - 1, 1),
          });
          toast.error(
            "You don't have enough nexoins so your signal level is decreased by 1"
          );
        } else {
          updateUser({
            nexoins: Math.max(user.nexoins - 50, 0),
            currentSignalGauge: +(
              user.currentSignalGauge -
              2 * Math.sqrt(user.currentSignalLevel)
            ).toFixed(2),
          });
          toast.info("You loose 50 nexoins! & some signal gauge!");
        }

        toast.error("Game Over! The monster has defeated you!");
      } else {
        handleEnemyState("attacking", "Attacking");
        toast.error(
          `Wrong! You got hurt! Try to use potion to recover your self`
        );
      }
    }
  };

  if (!flashCardSet?.id) {
    return <Loader />;
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
              <div className="flex flex-row items-center justify-center gap-2">
                {!isReviewMode &&
                  itemsList.map((item, index) => {
                    return (
                      <span
                        key={`potion-${index}`}
                        className="flex flex-row items-center justify-center gap-1"
                      >
                        <item.icon /> {user.ownedItems[item.specialId]}
                      </span>
                    );
                  })}
              </div>
              <Button
                type="button"
                title={isReviewMode ? "Magic Mode" : "Do Review"}
                onClick={() => {
                  setIsFlipped(false);
                  setIsReviewMode((prev) => !prev);
                }}
              ></Button>
            </div>
          </header>
          <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-128px)]">
            <div
              className={cn(
                "flex flex-row items-center w-full h-full gap-4 ",
                isReviewMode
                  ? "justify-center"
                  : gamifiedData.isCompleted
                  ? "justify-center"
                  : "justify-between"
              )}
            >
              {/* Flashcard content ought to be here */}
              {flashCardSet?.cards.length && !gamifiedData?.isCompleted ? (
                <main className="flex flex-col items-start justify-start w-5/8 h-full">
                  <section
                    className={cn(
                      "w-full bg-transparent mx-4 mt-4 flex flex-col items-start justify-start relative ",
                      isReviewMode ? "aspect-[16/10] " : "aspect-[16/8] "
                    )}
                  >
                    <section
                      className={cn(
                        "w-full h-full bg-primary text-white rounded-2xl card ",
                        isFlipped ? "flipped" : ""
                      )}
                      onClick={() =>
                        isReviewMode && setIsFlipped((prev) => !prev)
                      }
                    >
                      <div className="front h-full w-full flex flex-row items-center justify-center">
                        <header
                          style={{ zIndex: 10 }}
                          className="w-full flex flex-row items-center justify-between absolute top-4 left-0 px-6"
                        >
                          {!isReviewMode && (
                            <span className="flex flex-row items-center justify-center gap-2 text-background">
                              <Popover>
                                <PopoverTrigger>
                                  <Tooltip>
                                    <TooltipTrigger
                                      type="button"
                                      className="cursor-pointer"
                                    >
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
                                        Are you sure you want to spend 1 Hint
                                        potion to get a hint
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
                                  flashCardSet.cards[
                                    gamifiedData?.currentCard - 1
                                  ]?.hint
                                }
                              </span>
                            </span>
                          )}

                          <span className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (speechSignal === "speaking")
                                    stopSpeechSignal();
                                  else
                                    getSpeechSignal(
                                      isFlipped
                                        ? flashCardSet?.cards[
                                            gamifiedData?.currentCard - 1
                                          ]?.term || ""
                                        : flashCardSet?.cards[
                                            gamifiedData?.currentCard - 1
                                          ]?.definition || ""
                                    );
                                }}
                                type="button"
                                className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors text-background cursor-pointer`}
                              >
                                {speechSignal === "speaking" ? (
                                  <FaPlus className="rotate-45 text-base" />
                                ) : (
                                  <AiFillSound className="text-base" />
                                )}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {speechSignal === "speaking"
                                    ? "Stop sound"
                                    : "Play sound"}
                                </p>
                              </TooltipContent>
                            </Tooltip>

                            <SignalWave
                              active={speechSignal === "speaking"}
                              sentence={
                                flashCardSet?.cards[
                                  gamifiedData?.currentCard - 1
                                ]?.definition || ""
                              }
                            />
                          </span>
                        </header>
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
                          className="rounded-2xl"
                          style={{
                            opacity: 0.2,
                          }}
                        />
                      </div>
                      <div className="back h-full w-full flex flex-row items-center justify-center">
                        <header
                          style={{ zIndex: 10 }}
                          className="w-full flex flex-row items-center justify-between absolute top-4 left-0 px-6"
                        >
                          {!isReviewMode && (
                            <span className="flex flex-row items-center justify-center gap-2 text-background">
                              <Popover>
                                <PopoverTrigger>
                                  <Tooltip>
                                    <TooltipTrigger
                                      type="button"
                                      className="cursor-pointer"
                                    >
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
                                        Are you sure you want to spend 1 Hint
                                        potion to get a hint
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
                                  flashCardSet.cards[
                                    gamifiedData?.currentCard - 1
                                  ]?.hint
                                }
                              </span>
                            </span>
                          )}

                          <span className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger
                                onClick={(e) => {
                                  e.stopPropagation();

                                  if (speechSignal === "speaking")
                                    stopSpeechSignal();
                                  else
                                    getSpeechSignal(
                                      isFlipped
                                        ? flashCardSet?.cards[
                                            gamifiedData?.currentCard - 1
                                          ]?.term || ""
                                        : flashCardSet?.cards[
                                            gamifiedData?.currentCard - 1
                                          ]?.definition || ""
                                    );
                                }}
                                type="button"
                                className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors text-background cursor-pointer`}
                              >
                                {speechSignal === "speaking" ? (
                                  <FaPlus className="rotate-45 text-base" />
                                ) : (
                                  <AiFillSound className="text-base" />
                                )}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {speechSignal === "speaking"
                                    ? "Stop sound"
                                    : "Play sound"}
                                </p>
                              </TooltipContent>
                            </Tooltip>

                            <SignalWave
                              active={speechSignal === "speaking"}
                              sentence={
                                flashCardSet?.cards[
                                  gamifiedData?.currentCard - 1
                                ]?.definition || ""
                              }
                            />
                          </span>
                        </header>
                        <span style={{ zIndex: 10 }} className="text-4xl">
                          {
                            flashCardSet.cards[gamifiedData?.currentCard - 1]
                              ?.term
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
                          className="rounded-2xl"
                          style={{
                            opacity: 0.2,
                          }}
                        />
                      </div>
                    </section>
                  </section>
                  <section className="w-full mx-4 p-4 flex flex-row items-center justify-between rounded-xl">
                    {!isReviewMode && (
                      <span className="flex flex-row items-center gap-2">
                        <span className="text-lg">HP</span>
                        <div className="h-6 w-24 rounded overflow-hidden border-2 border-gray-700 shadow-inner relative">
                          <div
                            className="h-full bg-primary/60 transition-all duration-1000 absolute top-0 left-0"
                            style={{
                              width:
                                gamifiedData?.currentUserHealth.toFixed(2) +
                                "%",
                            }}
                          ></div>
                          <div
                            className="h-full bg-primary/5 transition-all duration-1000 absolute top-0 left-0"
                            style={{
                              width:
                                gamifiedData?.userHealthAfterHealthPotion.toFixed(
                                  2
                                ) + "%",
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
                                    Are you sure you want to spend 1 HP potion
                                    to recover health
                                  </p>
                                </div>
                                <div className="grid gap-2">
                                  <div className="grid grid-cols-3 items-center gap-4">
                                    <Button
                                      onClick={() => handleHealth()}
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
                    )}
                    <span className="flex flex-row items-center gap-4">
                      <Tooltip>
                        <TooltipTrigger
                          type="button"
                          disabled={gamifiedData.currentCard <= 1}
                          className="flex flex-row items-center justify-center p-2 h-10 w-14 rounded-full bg-muted/50 hover:bg-muted text-primary cursor-pointer disabled:bg-muted/20 disabled:cursor-not-allowed disabled:text-black/40"
                          onClick={() =>
                            setGamifiedData((prev) => ({
                              ...prev,
                              currentCard: prev.currentCard - 1,
                            }))
                          }
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
                          disabled={
                            gamifiedData.currentCard >=
                            gamifiedData.numberOfCards
                          }
                          className="flex flex-row items-center justify-center p-2 h-10 w-14 rounded-full bg-muted/50 hover:bg-muted text-primary cursor-pointer disabled:bg-muted/20 disabled:cursor-not-allowed disabled:text-black/40"
                          onClick={() =>
                            setGamifiedData((prev) => ({
                              ...prev,
                              currentCard: getNextCurrentCard(),
                            }))
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
                    {!isReviewMode &&
                      (gamifiedData?.correctedCards.includes(
                        gamifiedData?.currentCard
                      ) ? (
                        <>
                          <span className="text-xl text-primary">
                            You had completed this card
                          </span>
                        </>
                      ) : (
                        <>
                          {mappableOptions?.map((option, idx) => {
                            return (
                              <Button2
                                className="cursor-pointer"
                                onClick={() => handleOptionClick(option)}
                                key={idx}
                              >
                                {option}
                              </Button2>
                            );
                          })}
                        </>
                      ))}
                  </section>
                </main>
              ) : null}

              {!isReviewMode && (
                <main
                  className={
                    "flex flex-col items-start justify-start h-full w-3/8"
                  }
                >
                  <section className="h-full w-full text-white rounded-2xl m-4 px-4 flex flex-col items-start justify-start relative overflow-hidden">
                    <div className="h-full w-full flex flex-row items-center justify-center">
                      <Image
                        src={enemyState.src}
                        alt={enemyState.alt}
                        layout="fill"
                        className={enemyState.className}
                        style={{
                          transform: "scaleX(-1)",
                        }}
                      />
                      {gamifiedData.isCompleted ? (
                        gamifiedData.currentUserHealth <= 0 ? (
                          <h1 className="text-3xl text-primary">
                            The Monster won!!!
                          </h1>
                        ) : (
                          <h1 className="text-3xl text-primary">
                            Congratulations on Winning!!!
                          </h1>
                        )
                      ) : null}
                    </div>
                  </section>
                  <section className="w-full m-4 p-4 flex flex-row items-center justify-center rounded-xl">
                    <span className="flex flex-row items-center justify-center gap-2">
                      <span className="text-lg">HP</span>
                      <div className="h-6 w-24 rounded overflow-hidden border-2 border-gray-700 shadow-inner relative">
                        <div
                          className="h-full bg-destructive/60 transition-all duration-1000 absolute top-0 left-0"
                          style={{
                            width:
                              gamifiedData?.currentMonsterHealth.toFixed(2) +
                              "%",
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
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Page;
