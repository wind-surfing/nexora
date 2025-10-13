import { Card } from "@/types/cards";
import { Items } from "@/types/users";

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

export const itemsList: Items[] = [
  {
    specialId: 1,
    srcs: ["/health-potion.jpg"],
    title: "Health Potion",
    description: "Health potion comes in handy to make yourself feel better",
    price: 100,
    badge: "",
    theme: "#00ff00",
    requiredSignalGauge: 5,
  },
  {
    specialId: 2,
    srcs: ["/hint-potion.jpg"],
    title: "Hint Potion",
    description: "Everyone deserves a hint",
    price: 100,
    badge: "",
    theme: "#ffff00",
    requiredSignalGauge: 5,
  },
];

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
