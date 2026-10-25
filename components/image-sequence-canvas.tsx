"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  createSequenceLoader,
  drawCover,
  nearestLoaded,
  type Frame,
} from "@/lib/sequence-loader";

interface Props {
  name: string;
  frameCount: number;
  /** Extra scroll distance while pinned, in % of viewport height. */
  pinFor?: number;
  /** Load every Nth frame after frame 1, then fill gaps. */
  step?: number;
  /** Static image shown until frame 1 is drawn, and used when there are no frames or reduced motion. */
  poster?: string;
  enabled?: boolean;
  className?: string;
  /** Overlay content. `--p` (0→1 scroll progress) is set on the section for CSS-driven fades. */
  children?: ReactNode;
}

const pad = (n: number) => String(n).padStart(4, "0");

/**
 * Pins its section and scrubs a frame sequence on a <canvas> with scroll
 * (SPEC §5). Falls back to the static poster when frames are missing, on
 * prefers-reduced-motion, or when disabled. Mark `data-sequence-ready` once
 * something drawable is on screen.
 */
export function ImageSequenceCanvas({
  name,
  frameCount,
  pinFor = 200,
  step = 8,
  poster,
  enabled = true,
  className,
  children,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const markReady = () => section.setAttribute("data-sequence-ready", "");
    const poster = posterRef.current;
    if (!poster || poster.complete) markReady();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!enabled || reduced) return;

    const variant = window.matchMedia("(max-width: 767px), (orientation: portrait)").matches
      ? "mobile"
      : "desktop";
    const loader = createSequenceLoader({
      frameCount,
      step,
      urlFor: (i) => `/sequences/${name}/${variant}/${pad(i + 1)}.webp`,
    });

    let cancelled = false;
    let kill: (() => void) | undefined;

    void (async () => {
      if (!(await loader.first) || cancelled) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let current = 0;
      const draw = (index: number) => {
        const frame: Frame | undefined = nearestLoaded(loader.frames, index);
        if (!frame) return;
        current = index;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCover(ctx, frame, canvas.width, canvas.height);
      };
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(canvas.clientWidth * dpr);
        canvas.height = Math.round(canvas.clientHeight * dpr);
        draw(current);
      };

      resize();
      draw(0);
      setLive(true);
      markReady();
      window.addEventListener("resize", resize);
      void loader.start();

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${pinFor}%`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          section.style.setProperty("--p", self.progress.toFixed(4));
          draw(self.progress * (frameCount - 1));
        },
      });

      kill = () => {
        trigger.kill();
        window.removeEventListener("resize", resize);
      };
    })();

    return () => {
      cancelled = true;
      loader.abort();
      kill?.();
    };
  }, [name, frameCount, pinFor, step, enabled]);

  return (
    <section
      ref={sectionRef}
      className={`relative h-svh min-h-[600px] w-full overflow-hidden ${className ?? ""}`}
      style={{ "--p": 0 } as React.CSSProperties}
    >
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element -- LCP poster, preloaded via fetchPriority
        <img
          ref={posterRef}
          src={poster}
          alt=""
          fetchPriority="high"
          onLoad={() => sectionRef.current?.setAttribute("data-sequence-ready", "")}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-300 dark:invert ${live ? "opacity-0" : "opacity-100"}`}
        />
      )}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 size-full dark:invert ${live ? "opacity-100" : "opacity-0"}`}
      />
      {children}
    </section>
  );
}
