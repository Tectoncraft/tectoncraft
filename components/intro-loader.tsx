"use client";

import { useEffect, useRef, useState } from "react";
import { sequences } from "@/config/sequences";
import { LOADER_FLAG as FLAG } from "@/lib/loader-flag";
import {
  createSequenceLoader,
  drawCover,
  nearestLoaded,
} from "@/lib/sequence-loader";

const SNAP_MS = 500; // slabs lock into the T
const HOLD_MAX_MS = 800; // wait for the hero until here at most
const SPLIT_MS = 400; // screen splits horizontally

const heroReady = () => !!document.querySelector("[data-sequence-ready]");

type Phase = "play" | "split" | "done";

/**
 * First-visit loader: two slabs snap into the "T", then the screen splits to
 * reveal the hero (≤ 1.2 s). Uses a frame sequence if `sequences.loader` is
 * enabled, otherwise an SVG animation. Skipped if the hero is already ready by
 * the time the slabs have locked, and on reduced motion (via the inline flag).
 */
export function IntroLoader() {
  const [phase, setPhase] = useState<Phase>("play");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useFrames, setUseFrames] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    // Not flagged: the overlay stays display:none (see globals.css).
    if (!root.hasAttribute("data-loader")) return;

    const timers: number[] = [];
    const finish = () => {
      root.removeAttribute("data-loader");
      try {
        sessionStorage.setItem(FLAG, "1");
      } catch {}
      setPhase("done");
    };
    const split = () => {
      setPhase("split");
      timers.push(window.setTimeout(finish, SPLIT_MS));
    };

    const start = performance.now();
    const tick = () => {
      const elapsed = performance.now() - start;
      if (elapsed >= HOLD_MAX_MS || (elapsed >= SNAP_MS && heroReady())) split();
      else timers.push(window.setTimeout(tick, 50));
    };
    timers.push(window.setTimeout(tick, SNAP_MS));

    let raf = 0;
    const cfg = sequences.loader;
    const loader = cfg.enabled
      ? createSequenceLoader({
          frameCount: cfg.frameCount,
          step: cfg.step,
          urlFor: (i) => `/sequences/${cfg.name}/desktop/${String(i + 1).padStart(4, "0")}.webp`,
        })
      : null;

    if (loader) {
      void loader.first.then((ok) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ok || !canvas || !ctx) return;
        setUseFrames(true);
        void loader.start();
        const play = () => {
          const p = Math.min((performance.now() - start) / SNAP_MS, 1);
          const frame = nearestLoaded(loader.frames, p * (cfg.frameCount - 1));
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (frame) drawCover(ctx, frame, canvas.width, canvas.height);
          if (p < 1) raf = requestAnimationFrame(play);
        };
        play();
      });
    }

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      loader?.abort();
    };
  }, []);

  if (phase === "done") return null;
  const splitting = phase === "split";
  const panel = "absolute inset-x-0 h-1/2 bg-bg transition-transform ease-in-out";
  const move = { transitionDuration: `${SPLIT_MS}ms` };

  return (
    <div className="intro-loader fixed inset-0 z-[100]" aria-hidden="true">
      <div className={`${panel} top-0`} style={{ ...move, transform: splitting ? "translateY(-100%)" : undefined }} />
      <div className={`${panel} bottom-0`} style={{ ...move, transform: splitting ? "translateY(100%)" : undefined }} />
      <div
        className={`absolute inset-0 flex items-center justify-center text-fg transition-opacity duration-150 ${splitting ? "opacity-0" : "opacity-100"}`}
      >
        {useFrames ? (
          <canvas ref={canvasRef} width={512} height={512} className="size-40 dark:invert" />
        ) : (
          <>
            <canvas ref={canvasRef} className="hidden" />
            <svg viewBox="0 0 24 24" className="size-24" fill="currentColor">
              <g style={{ animation: `slab-left ${SNAP_MS}ms cubic-bezier(.2,.7,.2,1) both` }}>
                <rect x="1" y="2" width="11" height="8" />
                <rect x="8" y="12" width="4" height="10" />
              </g>
              <g style={{ animation: `slab-right ${SNAP_MS}ms cubic-bezier(.2,.7,.2,1) both` }}>
                <rect x="12" y="2" width="11" height="8" />
                <rect x="12" y="12" width="4" height="10" />
              </g>
            </svg>
          </>
        )}
      </div>
    </div>
  );
}
