import { useMemo } from "react";

type Sparkle = {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  hue: string;
};

const HUES = ["#FFE8A3", "#FBD7E4", "#F4A6C0", "#B9E3C6", "#FFFFFF"];

type Props = {
  count?: number;
  paused?: boolean;
};

export function SparkleLayer({ count = 18, paused = false }: Props) {
  const sparkles = useMemo<Sparkle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 5 + Math.random() * 8,
        delay: Math.random() * 3,
        duration: 2.8 + Math.random() * 3,
        hue: HUES[Math.floor(Math.random() * HUES.length)]!,
      })),
    [count],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            backgroundColor: s.hue,
            borderRadius: "50%",
            boxShadow: `0 0 ${s.size}px ${s.hue}`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            animationPlayState: paused ? "paused" : "running",
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}
