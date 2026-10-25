import type { ReactNode } from "react";

export const inputCls =
  "w-full border border-line bg-bg px-3 py-3 text-base outline-none transition-colors placeholder:text-muted focus:border-fg";

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between gap-4 text-sm font-medium">
        {label}
        {hint && <span className="font-normal text-muted">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

/** Off-screen trap for bots; real users never see or fill it. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
