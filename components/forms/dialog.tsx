"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Modal built on the native <dialog>: focus trap, Esc and inert background come for free. */
export function Modal({
  open,
  onClose,
  title,
  closeLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="modal-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto max-h-[90svh] w-[min(40rem,calc(100vw-2rem))] overflow-y-auto border border-fg bg-bg p-0 text-fg backdrop:bg-black/50"
    >
      {open && (
        <div className="relative p-6 md:p-10">
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="absolute right-3 top-3 inline-flex size-10 items-center justify-center text-2xl leading-none hover:bg-surface"
          >
            ×
          </button>
          <h2 id="modal-title" className="pr-10 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h2>
          {children}
        </div>
      )}
    </dialog>
  );
}
