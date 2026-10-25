#!/usr/bin/env bash
# Extract WebP frames from a generated video for ImageSequenceCanvas (SPEC §5).
#
#   pnpm frames <video> <name> [desktop|mobile]
#   pnpm frames hero-16x9.mp4 hero desktop     -> public/sequences/hero/desktop/0001.webp …
#   pnpm frames hero-9x16.mp4 hero mobile      -> 1080 px wide
#   pnpm frames loader.mp4    loader desktop   -> 36-frame loader (use a 1.5 s clip)
#
# Then set `enabled: true` and the printed frame count in config/sequences.ts.
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "usage: pnpm frames <video> <name> [desktop|mobile]" >&2
  exit 1
fi
input="$1"; name="$2"; variant="${3:-desktop}"

command -v ffmpeg >/dev/null || { echo "ffmpeg not found (brew install ffmpeg)" >&2; exit 1; }
[ -f "$input" ] || { echo "no such file: $input" >&2; exit 1; }

case "$variant" in
  desktop) width=1920 ;;
  mobile)  width=1080 ;;
  *) echo "variant must be desktop or mobile" >&2; exit 1 ;;
esac

out="public/sequences/$name/$variant"
rm -rf "$out"
mkdir -p "$out"

ffmpeg -hide_banner -loglevel error -i "$input" \
  -vf "fps=24,scale=${width}:-2" -c:v libwebp -quality 72 "$out/%04d.webp"

count=$(ls "$out" | wc -l | tr -d ' ')
size=$(du -sh "$out" | cut -f1)
echo "$count frames, $size -> $out"
echo "Targets: <= 4 MB desktop, <= 2.5 MB mobile, 90-150 frames. Set frameCount: $count in config/sequences.ts."
