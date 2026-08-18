"use client";

import { useRef, useState } from "react";

const CHARS = "01#/()[]_";

export function ScrambleText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [out, setOut] = useState(text);
  const timer = useRef<number>(0);

  function scramble() {
    window.clearInterval(timer.current);
    const start = performance.now();
    timer.current = window.setInterval(() => {
      const t = (performance.now() - start) / 400;
      if (t >= 1) {
        setOut(text);
        window.clearInterval(timer.current);
        return;
      }
      setOut(
        text
          .split("")
          .map((ch, i) => (ch === " " || i / text.length < t ? ch : CHARS[(i + Math.floor(t * 12)) % CHARS.length]))
          .join(""),
      );
    }, 32);
  }

  return (
    <span className={className} onMouseEnter={scramble}>
      {out}
    </span>
  );
}
