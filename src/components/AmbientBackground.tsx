const IMAGES = [
  { src: "/images/gardevoir4.jpg", top: "-8%", left: "-8%" },
  { src: "/images/nymphali4.jpg", top: "62%", left: "72%" },
  { src: "/images/gardevoir2.jpg", top: "58%", left: "-6%" },
  { src: "/images/nymphali3.jpg", top: "-6%", left: "68%" },
];

export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {IMAGES.map((img) => (
        <img
          key={img.src}
          src={img.src}
          alt=""
          loading="lazy"
          decoding="async"
          aria-hidden
          className="absolute will-change-transform"
          style={{
            top: img.top,
            left: img.left,
            width: "220px",
            height: "220px",
            objectFit: "cover",
            borderRadius: "50%",
            filter: "blur(18px) saturate(1.1)",
            opacity: 0.35,
            transform: "scale(2.6)",
            transformOrigin: "center",
          }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(255, 247, 251, 0.55) 0%, rgba(255, 247, 251, 0.85) 70%)",
        }}
      />
    </div>
  );
}
