"use client";

import { useState, useEffect } from "react";
import { WordPullUp } from "./word-pull-up";

interface RotatingWordsProps {
  words: string[];
  interval?: number;
  className?: string;
}

export function RotatingWords({
  words,
  interval = 3000,
  className = "text-5xl font-bold text-blue-700",
}: RotatingWordsProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      setKey((prevKey) => prevKey + 1); // Force re-render for animation
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <div key={key}>
      <WordPullUp
        words={words[currentWordIndex]}
        className={className}
        wrapperFramerProps={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        framerProps={{
          hidden: { y: 20, opacity: 0 },
          show: { y: 0, opacity: 1 },
        }}
      />
    </div>
  );
}
