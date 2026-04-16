import type { CSSProperties } from "react";

type Card = {
  src: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  width: string;
  objectPosition: string;
  rotate: number;
  delay: number;
};

const CARDS: Card[] = [
  {
    src: "/images/nymphali3.jpg",
    position: { top: "2%", left: "-20px" },
    width: "clamp(88px, 20vw, 185px)",
    objectPosition: "center 22%",
    rotate: -8,
    delay: 0,
  },
  {
    src: "/images/gardevoir4.jpg",
    position: { top: "5%", right: "-16px" },
    width: "clamp(96px, 22vw, 200px)",
    objectPosition: "center 15%",
    rotate: 7,
    delay: 1.4,
  },
  {
    src: "/images/nymphali4.jpg",
    position: { bottom: "6%", left: "-22px" },
    width: "clamp(88px, 20vw, 185px)",
    objectPosition: "center 22%",
    rotate: 5,
    delay: 2.8,
  },
  {
    src: "/images/gardevoir2.jpg",
    position: { bottom: "8%", right: "-18px" },
    width: "clamp(80px, 18vw, 165px)",
    objectPosition: "center 30%",
    rotate: -4,
    delay: 4.2,
  },
];

const MASK = "linear-gradient(to bottom, black 0%, black 52%, transparent 95%)";

export function DecorativeCards() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {CARDS.map((c) => (
        <img
          key={c.src}
          src={c.src}
          alt=""
          loading="lazy"
          decoding="async"
          className="deco-card pointer-events-auto absolute animate-float rounded-xl lg:rounded-2xl border-[3px] lg:border-[5px] border-white/80 opacity-40 sm:opacity-55 lg:opacity-90"
          style={
            {
              ...c.position,
              width: c.width,
              aspectRatio: "5 / 7",
              objectFit: "cover",
              objectPosition: c.objectPosition,
              animationDelay: `${c.delay}s`,
              animationDuration: "7s",
              maskImage: MASK,
              WebkitMaskImage: MASK,
              "--card-rotate": `${c.rotate}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
