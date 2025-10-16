import React, { useEffect, useState } from "react";
import "@/styles/signalwave-styles.css";

export default function SignalWave({
  active,
  sentence,
}: {
  active: boolean;
  sentence: string;
}) {
  const [bars, setBars] = useState<
    { height: number; duration: number; delay: number }[]
  >([]);

  useEffect(() => {
    if (sentence) {
      const seed = Array.from(sentence).reduce(
        (accumulator, character) => accumulator + character.charCodeAt(0),
        0
      );
      const random = (n: number) => Math.abs(Math.sin(seed * n)) % 1;

      const newBars = Array.from({ length: 28 }).map((_, i) => ({
        height: 4 + random(i) * 10,
        duration: 0.9 + random(i + 1) * 0.8,
        delay: random(i + 2) * 1.2,
      }));

      setBars(newBars);
    }
  }, [sentence]);

  return (
    <div className={`signal-container ${active ? "active" : "idle"}`}>
      {bars.map((bar, i) => (
        <div
          key={i}
          className="signal-bar"
          style={{
            animation: active
              ? `signalPulse ${bar.duration}s ease-in-out ${bar.delay}s infinite`
              : "none",
            height: `${bar.height}px`,
          }}
        />
      ))}
    </div>
  );
}
