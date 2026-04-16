import { useCallback, useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import type { Tome } from "../hooks/useTomes";

export type WheelHandle = {
  spin: () => void;
};

type Props = {
  tomes: Tome[];
  onSpinStart?: () => void;
  onSpinEnd?: (winner: Tome) => void;
  spinning: boolean;
};

const SLICE_PALETTE = [
  "#F4A6C0",
  "#B9E3C6",
  "#FBD7E4",
  "#7BB79B",
  "#EC7FA9",
  "#D5EBDD",
];

function pickColor(i: number, total: number): string {
  if (total === 1) return SLICE_PALETTE[0]!;
  if (total === 2) return SLICE_PALETTE[i * 2]!;
  return SLICE_PALETTE[i % SLICE_PALETTE.length]!;
}

function fitLabel(label: string, maxChars: number): string {
  if (label.length <= maxChars) return label;
  return `${label.slice(0, Math.max(1, maxChars - 1))}…`;
}

function lighten(hex: string, amount: number): string {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

const TAU = Math.PI * 2;

export const Wheel = forwardRef<WheelHandle, Props>(function Wheel(
  { tomes, onSpinStart, onSpinEnd, spinning },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const tomesRef = useRef(tomes);
  tomesRef.current = tomes;

  // Render static wheel to canvas (slices + labels + gem). Called only on size/tomes change.
  const renderStatic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssSize = canvas.clientWidth;
    const size = Math.max(320, Math.floor(cssSize * dpr));
    if (canvas.width !== size || canvas.height !== size) {
      canvas.width = size;
      canvas.height = size;
    }

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = canvas.width / 2 - 8 * dpr;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const list = tomesRef.current;

    if (list.length === 0) {
      ctx.save();
      ctx.translate(cx, cy);
      const grad = ctx.createLinearGradient(-radius, -radius, radius, radius);
      grad.addColorStop(0, "#FBD7E4");
      grad.addColorStop(1, "#B9E3C6");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.42, 0, TAU);
      ctx.fill();
      ctx.font = `${18 * dpr}px 'Quicksand', sans-serif`;
      ctx.fillStyle = "#B24473";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Ajoute un tome ✨", 0, 0);
      ctx.restore();
      drawCenterGem(ctx, cx, cy, radius, dpr);
      return;
    }

    const n = list.length;
    const sliceAngle = TAU / n;

    ctx.save();
    ctx.translate(cx, cy);

    for (let i = 0; i < n; i++) {
      const start = i * sliceAngle;
      const end = start + sliceAngle;
      const mid = start + sliceAngle / 2;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, end);
      ctx.closePath();

      const grad = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
      const base = pickColor(i, n);
      grad.addColorStop(0, lighten(base, 0.25));
      grad.addColorStop(1, base);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = 2 * dpr;
      ctx.stroke();

      ctx.save();
      ctx.rotate(mid);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      const fontSize = Math.max(12, Math.min(24, 18 - n * 0.2)) * dpr;
      ctx.font = `600 ${fontSize}px 'Quicksand', sans-serif`;
      ctx.fillStyle = "#3A2A3A";
      ctx.shadowColor = "rgba(255,255,255,0.75)";
      ctx.shadowBlur = 3 * dpr;
      const maxChars = Math.max(8, Math.min(22, Math.floor(40 / Math.sqrt(n))));
      const label = fitLabel(list[i]!.label, maxChars);
      ctx.fillText(label, radius - 16 * dpr, 0);
      ctx.restore();
    }

    ctx.restore();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 6 * dpr;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.stroke();

    ctx.strokeStyle = "rgba(178, 68, 115, 0.35)";
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 3 * dpr, 0, TAU);
    ctx.stroke();

    drawCenterGem(ctx, cx, cy, radius, dpr);
  }, []);

  // Apply current rotation to canvas via CSS transform (compositor-only, zero redraw cost).
  const applyRotation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.transform = `rotate(${rotationRef.current}rad)`;
  }, []);

  useEffect(() => {
    renderStatic();
    applyRotation();
    const onResize = () => renderStatic();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [renderStatic, applyRotation, tomes]);

  const spin = useCallback(() => {
    const list = tomesRef.current;
    if (list.length < 2) return;
    if (animRef.current !== null) return;

    onSpinStart?.();

    const n = list.length;
    const sliceAngle = TAU / n;
    const targetIndex = Math.floor(Math.random() * n);
    const sliceCenter = (targetIndex + 0.5) * sliceAngle;
    const jitter = (Math.random() - 0.5) * sliceAngle * 0.7;

    const pointerAngle = -Math.PI / 2;
    const desired = pointerAngle - sliceCenter + jitter;

    const current = rotationRef.current;
    const currentMod = ((current % TAU) + TAU) % TAU;
    const desiredMod = ((desired % TAU) + TAU) % TAU;
    let delta = desiredMod - currentMod;
    if (delta < 0) delta += TAU;

    const turns = 5 + Math.floor(Math.random() * 3);
    const totalDelta = turns * TAU + delta;
    const start = current;
    const end = current + totalDelta;
    const duration = 4600 + Math.random() * 900;
    const startTs = performance.now();

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3.2);

    const step = (ts: number) => {
      const t = Math.min(1, (ts - startTs) / duration);
      const eased = easeOut(t);
      rotationRef.current = start + (end - start) * eased;
      applyRotation();
      if (t < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        animRef.current = null;
        onSpinEnd?.(list[targetIndex]!);
      }
    };
    animRef.current = requestAnimationFrame(step);
  }, [applyRotation, onSpinStart, onSpinEnd]);

  useImperativeHandle(ref, () => ({ spin }), [spin]);

  useEffect(() => {
    return () => {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, []);

  return (
    <div className="relative aspect-square w-full max-w-[460px] mx-auto select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full drop-shadow-[0_20px_40px_rgba(178,68,115,0.3)]"
        style={{
          transformOrigin: "center",
          willChange: "transform",
        }}
        aria-label="Roue de sélection"
      />
      <div className="absolute left-1/2 -translate-x-1/2 -top-1" aria-hidden>
        <svg width="44" height="56" viewBox="0 0 44 56">
          <defs>
            <linearGradient id="pointer-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF7FB" />
              <stop offset="60%" stopColor="#F4A6C0" />
              <stop offset="100%" stopColor="#B24473" />
            </linearGradient>
          </defs>
          <path
            d="M22 54 L4 22 Q4 4 22 4 Q40 4 40 22 Z"
            fill="url(#pointer-grad)"
            stroke="white"
            strokeWidth="3"
          />
          <circle cx="22" cy="20" r="5" fill="#E24A6A" stroke="white" strokeWidth="2" />
        </svg>
      </div>
      <button
        type="button"
        onClick={spin}
        disabled={spinning || tomes.length < 2}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          size-[18%] min-w-[70px] min-h-[70px] rounded-full
          bg-gradient-to-br from-white via-fairy-blush to-fairy-petal
          border-[3px] border-white shadow-gem
          font-display font-bold text-fairy-deep
          hover:scale-105 active:scale-95 transition-transform
          disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        aria-label={spinning ? "La roue tourne…" : "Faire tourner la roue"}
      >
        {spinning ? "…" : "GO"}
      </button>
    </div>
  );
});

function drawCenterGem(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  dpr: number,
) {
  const hubR = radius * 0.18;
  const gemGrad = ctx.createRadialGradient(
    cx - hubR * 0.3,
    cy - hubR * 0.3,
    hubR * 0.1,
    cx,
    cy,
    hubR,
  );
  gemGrad.addColorStop(0, "#FFF");
  gemGrad.addColorStop(0.35, "#FBD7E4");
  gemGrad.addColorStop(1, "#EC7FA9");
  ctx.fillStyle = gemGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, hubR, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
  ctx.lineWidth = 3 * dpr;
  ctx.stroke();
}
