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
    options: ["", "", ""],
    hint: "",
    theme: "",
    category: "",
  },
  {
    term: "",
    definition: "",
    src: "",
    alt: "",
    options: ["", "", ""],
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
  options: ["", "", ""],
  hint: "",
  theme: "",
  category: "",
};

export type ShortcutConfig = {
  category: string;
  shorts: {
    key: string;
    action: string;
    function: () => void;
  }[];
}[];

export const createShortcuts = (handlers: {
  onImport: () => void;
  onExport: () => void;
  onGenerateAI: () => void;
  onFlip: () => void;
  onAdd: () => void;
  onSave: () => void;
  onClear: () => void;
}): ShortcutConfig => [
  {
    category: "Externals",
    shorts: [
      {
        key: "Alt + I",
        action: "Import",
        function: handlers.onImport,
      },
      {
        key: "Alt + E",
        action: "Export",
        function: handlers.onExport,
      },
    ],
  },
  {
    category: "Utils",
    shorts: [
      {
        key: "Alt + M",
        action: "AI",
        function: handlers.onGenerateAI,
      },
      {
        key: "Alt + F",
        action: "Flip",
        function: handlers.onFlip,
      },
    ],
  },
  {
    category: "Actions",
    shorts: [
      {
        key: "Alt + N",
        action: "Add",
        function: handlers.onAdd,
      },
      {
        key: "Alt + L",
        action: "Save",
        function: handlers.onSave,
      },
      {
        key: "Alt + C",
        action: "Clear",
        function: handlers.onClear,
      },
    ],
  },
];
