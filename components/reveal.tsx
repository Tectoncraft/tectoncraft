"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/** Card/block reveal on enter. Initial state is hidden; <noscript> CSS in the layout reveals it without JS. */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-reveal
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
        seen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Section heading: words rise 12 px and fade in, staggered 40 ms. */
export function RevealHeading({
  as: Tag = "h2",
  children,
  className = "",
}: {
  as?: ElementType;
  children: string;
  className?: string;
}) {
  const [ref, seen] = useInView<HTMLElement>();
  const words = children.split(" ");
  return (
    <Tag ref={ref} className={className} aria-label={children}>
      {words.map((word, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom">
          <span
            data-reveal
            style={{ transitionDelay: `${i * 40}ms` }}
            className={`inline-block transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
              seen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
