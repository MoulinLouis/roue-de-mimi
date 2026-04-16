import { useRef, useState } from "react";
import { DecorativeCards } from "./components/DecorativeCards";
import { SparkleLayer } from "./components/SparkleLayer";
import { TomeList } from "./components/TomeList";
import { Wheel, type WheelHandle } from "./components/Wheel";
import { WinnerModal } from "./components/WinnerModal";
import { useTomes } from "./hooks/useTomes";
import type { Tome } from "./hooks/useTomes";

export default function App() {
  const { tomes, add, remove, clear } = useTomes();
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Tome | null>(null);
  const wheelRef = useRef<WheelHandle>(null);

  function handleSpinStart() {
    setWinner(null);
    setSpinning(true);
  }

  function handleSpinEnd(w: Tome) {
    setSpinning(false);
    setWinner(w);
  }

  function handleRespin() {
    setWinner(null);
    // allow modal exit animation to start before spinning
    window.setTimeout(() => wheelRef.current?.spin(), 150);
  }

  return (
    <>
      <SparkleLayer paused={spinning} />
      <DecorativeCards />

      <main className="relative z-10 min-h-screen w-full px-4 sm:px-6 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl flex flex-col gap-10">
          <header className="text-center flex flex-col gap-3">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-fairy-rose border border-fairy-blush animate-float">
              <span aria-hidden>✦</span>
              <span>Type fée activé</span>
              <span aria-hidden>✦</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-semibold text-fairy-deep text-shadow-soft">
              La Roue de Mimi
            </h1>
            <p className="max-w-xl mx-auto text-fairy-deep/75 text-balance">
              Laissons la magie du hasard choisir ton tome! (stp scooby dooooo)
            </p>
          </header>

          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
            <div className="panel p-6 sm:p-8 flex flex-col items-center gap-6">
              <Wheel
                ref={wheelRef}
                tomes={tomes}
                spinning={spinning}
                onSpinStart={handleSpinStart}
                onSpinEnd={handleSpinEnd}
              />
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => wheelRef.current?.spin()}
                  disabled={spinning || tomes.length < 2}
                  className="btn-primary text-lg px-8 py-4"
                >
                  <span aria-hidden>✨</span>
                  {spinning ? "La roue tourne…" : "Lancer la roue"}
                  <span aria-hidden>✨</span>
                </button>
                {tomes.length < 2 && (
                  <p className="text-sm text-fairy-deep/60">
                    Ajoute au moins 2 tomes pour lancer la roue.
                  </p>
                )}
              </div>
            </div>

            <TomeList
              tomes={tomes}
              onAdd={add}
              onRemove={remove}
              onClear={clear}
              disabled={spinning}
            />
          </div>

          <footer className="text-center text-sm text-fairy-deep/60 pt-4">
            Fait avec Amour pour Mimi ❤️
          </footer>
        </div>
      </main>

      <WinnerModal
        winner={winner}
        onClose={() => setWinner(null)}
        onRespin={handleRespin}
      />
    </>
  );
}
