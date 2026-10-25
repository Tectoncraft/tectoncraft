import { describe, expect, it } from "vitest";
import { loadOrder, nearestLoaded } from "./sequence-loader";

describe("loadOrder", () => {
  it("loads frame 1, then every Nth frame and the last, then fills gaps", () => {
    expect(loadOrder(20, 8)).toEqual([0, 8, 16, 19, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 17, 18]);
  });

  it("visits every frame exactly once", () => {
    const order = loadOrder(144, 8);
    expect(new Set(order).size).toBe(144);
    expect(order.slice(0, 3)).toEqual([0, 8, 16]);
  });

  it("handles tiny sequences", () => {
    expect(loadOrder(0, 8)).toEqual([]);
    expect(loadOrder(1, 8)).toEqual([0]);
  });
});

describe("nearestLoaded", () => {
  const frames = ["a", undefined, undefined, undefined, "e", undefined, undefined];
  it("returns the exact frame when loaded", () => {
    expect(nearestLoaded(frames, 4)).toBe("e");
  });
  it("returns the closest loaded frame, earlier on ties", () => {
    expect(nearestLoaded(frames, 1)).toBe("a");
    expect(nearestLoaded(frames, 3)).toBe("e");
    expect(nearestLoaded(frames, 2)).toBe("a");
    expect(nearestLoaded(frames, 6)).toBe("e");
  });
  it("is undefined when nothing is loaded", () => {
    expect(nearestLoaded([undefined, undefined], 1)).toBeUndefined();
  });
});
