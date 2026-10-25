import { Link } from "@/i18n/navigation";

/** "T" built from two interlocking slabs: a top bar and a stem that notches into it. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <rect x="1" y="2" width="22" height="8" />
      <rect x="8" y="12" width="8" height="10" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="tectoncraft"
      className={`inline-flex items-center gap-2 ${className ?? ""}`}
    >
      <LogoMark className="size-6" />
      <span className="font-display text-xl font-semibold tracking-tight">
        tectoncraft
      </span>
    </Link>
  );
}
