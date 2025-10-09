import { useEffect } from "react";

interface ShortcutItem {
  key: string;
  action: string;
  function: () => void;
}

interface ShortcutCategory {
  category: string;
  shorts: ShortcutItem[];
}

export const useShortcuts = (shortcuts: ShortcutCategory[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey) return;

      const key = event.key.toUpperCase();
      const shortcutKey = `Alt + ${key}`;

      for (const category of shortcuts) {
        const shortcut = category.shorts.find((s) => s.key === shortcutKey);
        if (shortcut) {
          event.preventDefault();
          shortcut.function();
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]);

  return shortcuts.reduce<{ key: string; action: string }[]>(
    (acc, category) => {
      return [
        ...acc,
        ...category.shorts.map((s) => ({ key: s.key, action: s.action })),
      ];
    },
    []
  );
};
