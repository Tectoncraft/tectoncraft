import { ImageResponse } from "next/og";

export const alt = "tectoncraft";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Monochrome social card: the slab "T" and wordmark. */
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", color: "#0a0a0a", gap: 48 }}>
        <svg width="220" height="220" viewBox="0 0 24 24" fill="#0a0a0a">
          <rect x="1" y="2" width="22" height="8" />
          <rect x="8" y="12" width="8" height="10" />
        </svg>
        <div style={{ fontSize: 140, fontWeight: 700, letterSpacing: -6 }}>tectoncraft</div>
      </div>
    ),
    size,
  );
}
