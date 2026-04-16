import { AnimatePresence, motion } from "framer-motion";
import { type FormEvent, useRef, useState } from "react";
import type { Tome } from "../hooks/useTomes";

type Props = {
  tomes: Tome[];
  onAdd: (label: string) => boolean;
  onRemove: (id: string) => void;
  onClear: () => void;
  disabled?: boolean;
};

export function TomeList({ tomes, onAdd, onRemove, onClear, disabled }: Props) {
  const [value, setValue] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    const ok = onAdd(value);
    if (ok) setValue("");
    inputRef.current?.focus();
  }

  function handleClear() {
    if (!confirmClear) {
      setConfirmClear(true);
      window.setTimeout(() => setConfirmClear(false), 2500);
      return;
    }
    onClear();
    setConfirmClear(false);
  }

  return (
    <section className="panel p-6 sm:p-7 flex flex-col gap-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-fairy-deep">
            Tes coloriages
          </h2>
          <p className="text-sm text-fairy-deep/70">
            Ajoute tes tomes, la roue choisira pour toi.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-fairy-blush/60 px-3 py-1 text-sm font-semibold text-fairy-deep">
          {tomes.length}
        </span>
      </header>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Nom du tome…"
          maxLength={80}
          disabled={disabled}
          className="input-fairy flex-1"
          aria-label="Nom du tome à ajouter"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="btn-primary shrink-0"
          aria-label="Ajouter"
        >
          <span aria-hidden>＋</span>
          <span className="hidden sm:inline">Ajouter</span>
        </button>
      </form>

      <ul className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {tomes.map((t) => (
            <motion.li
              key={t.id}
              layout
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="chip"
            >
              <span className="truncate">{t.label}</span>
              <button
                type="button"
                onClick={() => onRemove(t.id)}
                disabled={disabled}
                className="shrink-0 rounded-full p-1 text-fairy-petal hover:text-fairy-deep hover:bg-fairy-blush/50 transition disabled:opacity-40"
                aria-label={`Supprimer ${t.label}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
        {tomes.length === 0 && (
          <li className="text-center text-sm text-fairy-deep/50 py-6 italic">
            Ta liste est encore vide… ✨
          </li>
        )}
      </ul>

      {tomes.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="btn-ghost"
          >
            {confirmClear ? "Confirmer ?" : "Tout effacer"}
          </button>
        </div>
      )}
    </section>
  );
}
