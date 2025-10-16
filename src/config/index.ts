import { Card } from "@/types/cards";
import { Items, User } from "@/types/users";

export const credentials = [
  {
    username: "user",
    password: "password",
    coins: 600,
  },
  {
    username: "test123",
    password: "test123",
    coins: 600,
  },
  {
    username: process.env.NEXT_PUBLIC_ADMIN_USERNAME!,
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD!,
    secure: true,
    coins: 100000,
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

export const mockUser: User = {
  username: "",
  currentSignalGauge: 0,
  requiredSignalGauge: 0,
  currentSignalLevel: 0,
  lastSignalAt: new Date(),
  nexoins: 0,
  ownedItems: {
    health: 0,
    hint: 0,
  },
};

export const itemsList: Items[] = [
  {
    specialId: "hint",
    srcs: ["/hint-potion.jpg"],
    title: "Hint Potion",
    description: "Everyone deserves a hint",
    price: 40,
    badge: "",
    theme: "#ffff00",
    requiredSignalLevel: 1,
  },
  {
    specialId: "health",
    srcs: ["/health-potion.jpg"],
    title: "Health Potion",
    description: "Health is wealth",
    price: 120,
    badge: "",
    theme: "#00ff00",
    requiredSignalLevel: 3,
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
