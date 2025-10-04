import { Card } from "@/types/cards";

export const credentials = [
  {
    username: "user",
    password: "password",
    coins: 30,
  },
  {
    username: "test123",
    password: "test123",
    coins: 30,
  },
  {
    username: process.env.NEXT_PUBLIC_ADMIN_USERNAME!,
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD!,
    secure: true,
    coins: 1000,
  },
];

export const defaultCardSetDataList: Card[] = [
  {
    term: "",
    definition: "",
    src: "",
    alt: "",
    options: [] as string[],
    hint: "",
    theme: "",
    category: "",
  },
  {
    term: "",
    definition: "",
    src: "",
    alt: "",
    options: [] as string[],
    hint: "",
    theme: "",
    category: "",
  },
];

export const singleCardSetData: Card = {
  term: "",
  definition: "",
  src: "",
  alt: "",
  options: [] as string[],
  hint: "",
  theme: "",
  category: "",
};

export const shortcuts = [
  {
    category: "Externals" as string,
    shorts: [
      {
        key: "Ctrl + I",
        action: "Import",
      },
      {
        key: "Ctrl + E",
        action: "Export",
      },
    ] as { key: string; action: string }[],
  },
  {
    category: "Utils" as string,
    shorts: [
      {
        key: "Ctrl + P",
        action: "Practise",
      },
      {
        key: "Ctrl + T",
        action: "Suggestions",
      },
      {
        key: "Ctrl + K",
        action: "Keyboard",
      },
      {
        key: "Ctrl + M",
        action: "AI",
      },
      {
        key: "Ctrl + F",
        action: "Flip",
      },
    ] as { key: string; action: string }[],
  },
  {
    category: "Actions" as string,
    shorts: [
      {
        key: "Ctrl + N",
        action: "Add",
      },
      {
        key: "Ctrl + S",
        action: "Save",
      },
      {
        key: "Ctrl + C",
        action: "Clear",
      },
    ] as { key: string; action: string }[],
  },
];
