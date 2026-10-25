/**
 * Scroll-scrubbed / loader frame sequences (SPEC §5).
 * Drop frames in `public/sequences/<name>/{desktop,mobile}/0001.webp …` (see
 * scripts/extract-frames.sh), set `enabled: true` and match `frameCount`.
 * Until then the static `poster` is shown and nothing is pinned.
 */
export interface SequenceConfig {
  name: string;
  enabled: boolean;
  frameCount: number;
  /** Extra scroll distance while pinned, in % of viewport height. */
  pinFor?: number;
  /** Progressive loading: after frame 1, load every Nth frame, then fill gaps. */
  step: number;
  /** LCP image. Switch to `/sequences/hero/desktop/0001.webp` once frames exist. */
  poster?: string;
}

export const sequences = {
  hero: {
    name: "hero",
    enabled: false,
    frameCount: 144,
    pinFor: 200,
    step: 8,
    poster: "/sequences/hero/poster.svg",
  },
  loader: {
    name: "loader",
    enabled: false,
    frameCount: 36,
    step: 1,
  },
} satisfies Record<string, SequenceConfig>;
