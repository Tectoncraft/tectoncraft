export type Frame = CanvasImageSource & { width: number; height: number };

/**
 * Order in which frames are fetched: frame 1, then every `step`th frame (plus the
 * last, so the end state is available early), then the remaining gaps.
 */
export function loadOrder(frameCount: number, step: number): number[] {
  if (frameCount <= 0) return [];
  const order = [0];
  const seen = new Set(order);
  const push = (i: number) => {
    if (i < frameCount && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  for (let i = step; i < frameCount; i += step) push(i);
  push(frameCount - 1);
  for (let i = 1; i < frameCount; i++) push(i);
  return order;
}

/** Closest loaded frame to `index` (ties go to the earlier frame). */
export function nearestLoaded<T>(frames: readonly (T | undefined)[], index: number): T | undefined {
  const last = frames.length - 1;
  const start = Math.min(Math.max(Math.round(index), 0), last);
  for (let d = 0; d <= last; d++) {
    const before = frames[start - d];
    if (before) return before;
    const after = frames[start + d];
    if (after) return after;
  }
  return undefined;
}

export interface SequenceLoaderOptions {
  frameCount: number;
  step: number;
  urlFor: (index: number) => string;
  /** Called every time a frame finishes loading. */
  onFrame?: (index: number) => void;
  concurrency?: number;
}

export interface SequenceLoader {
  frames: (Frame | undefined)[];
  /** Resolves true when frame 1 is ready, false if it failed (e.g. no frames dropped in yet). */
  first: Promise<boolean>;
  /** Load the remaining frames progressively. */
  start: () => Promise<void>;
  abort: () => void;
}

function loadImage(url: string): Promise<HTMLImageElement | undefined> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(undefined);
    img.src = url;
  });
}

export function createSequenceLoader(opts: SequenceLoaderOptions): SequenceLoader {
  const { frameCount, step, urlFor, onFrame, concurrency = 4 } = opts;
  const frames: (Frame | undefined)[] = new Array(frameCount).fill(undefined);
  let aborted = false;

  const load = async (i: number) => {
    const img = await loadImage(urlFor(i));
    if (aborted || !img) return false;
    frames[i] = img;
    onFrame?.(i);
    return true;
  };

  const first = load(0);

  const start = async () => {
    const queue = loadOrder(frameCount, step).slice(1);
    const worker = async () => {
      for (let i = queue.shift(); i !== undefined && !aborted; i = queue.shift()) {
        await load(i);
      }
    };
    await Promise.all(Array.from({ length: concurrency }, worker));
  };

  return { frames, first, start, abort: () => (aborted = true) };
}

/** Draw `frame` onto `ctx` like CSS object-fit: cover. */
export function drawCover(ctx: CanvasRenderingContext2D, frame: Frame, w: number, h: number) {
  const scale = Math.max(w / frame.width, h / frame.height);
  const dw = frame.width * scale;
  const dh = frame.height * scale;
  ctx.drawImage(frame, (w - dw) / 2, (h - dh) / 2, dw, dh);
}
