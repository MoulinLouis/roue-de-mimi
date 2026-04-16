import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import type { Tome } from "../hooks/useTomes";

type Props = {
  winner: Tome | null;
  onClose: () => void;
  onRespin: () => void;
};

const CONFETTI_COLORS = ["#F4A6C0", "#B9E3C6", "#FFE8A3", "#FBD7E4", "#EC7FA9", "#FFFFFF"];

type Confetto = {
  id: number;
  x: number;
  y: number;
  rot: number;
  dx: number;
  dy: number;
  drot: number;
  color: string;
  size: number;
  duration: number;
};

export function WinnerModal({ winner, onClose, onRespin }: Props) {
  useEffect(() => {
    if (!winner) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [winner, onClose]);

  const confetti = useMemo<Confetto[]>(() => {
    if (!winner) return [];
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: 0,
      y: 0,
      rot: Math.random() * 360,
      dx: (Math.random() - 0.5) * 600,
      dy: 200 + Math.random() * 600,
      drot: (Math.random() - 0.5) * 720,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]!,
      size: 6 + Math.random() * 10,
      duration: 1.4 + Math.random() * 1.6,
    }));
  }, [winner]);

  return (
    <AnimatePresence>
      {winner && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-fairy-deep/30 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Confetti */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2">
              {confetti.map((c) => (
                <motion.span
                  key={c.id}
                  className="absolute block rounded-sm"
                  style={{
                    width: c.size,
                    height: c.size * 0.4,
                    backgroundColor: c.color,
                    boxShadow: `0 0 8px ${c.color}80`,
                  }}
                  initial={{ x: 0, y: 0, rotate: c.rot, opacity: 1 }}
                  animate={{
                    x: c.dx,
                    y: c.dy,
                    rotate: c.rot + c.drot,
                    opacity: 0,
                  }}
                  transition={{ duration: c.duration, ease: "easeOut" }}
                />
              ))}
            </div>
          </div>

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Tome choisi"
            className="panel relative z-10 w-full max-w-md p-8 text-center flex flex-col gap-6"
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <motion.div
              className="mx-auto text-4xl"
              initial={{ rotate: -12, scale: 0.8 }}
              animate={{ rotate: [0, 8, -6, 0], scale: [0.8, 1.1, 1] }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              aria-hidden
            >
              ✨
            </motion.div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-fairy-petal font-semibold">
                La roue a choisi
              </p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl font-semibold text-fairy-deep text-shadow-soft text-balance">
                {winner.label}
              </h2>
            </div>
            <p className="text-fairy-deep/70">
              Prépare tes feutres, c'est parti !
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button type="button" onClick={onClose} className="btn-primary">
                C'est parti !
              </button>
              <button type="button" onClick={onRespin} className="btn-ghost">
                Relancer la roue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
