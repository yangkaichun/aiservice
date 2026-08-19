#!/bin/bash
# v3 效能批次：HD 圖轉 WebP（q80）+ 壓縮 twno1.png
cd "$(dirname "$0")/assets"

echo "=== 轉換 HD 圖 → WebP ==="
count=0
for f in *_hd.jpg; do
  [ -f "$f" ] || continue
  out="${f%.jpg}.webp"
  if [ -f "$out" ]; then echo "SKIP: $out"; continue; fi
  orig=$(stat -f%z "$f")
  cwebp -q 80 "$f" -o "$out" >/dev/null 2>&1
  new=$(stat -f%z "$out" 2>/dev/null || echo 0)
  pct=$(( 100 - new * 100 / orig ))
  printf "  %-40s %5.0fKB → %5.0fKB (-%d%%)\n" "${f%.jpg}" "$((orig/1024))" "$((new/1024))" "$pct"
  count=$((count+1))
done
echo "轉換 $count 張"

echo "=== 壓縮 twno1.png ==="
if [ -f twno1.png ]; then
  orig=$(stat -f%z twno1.png)
  sips -s format png -Z 800 twno1.png --out twno1_small.png >/dev/null 2>&1
  new=$(stat -f%z twno1_small.png)
  printf "  twno1.png: %dKB → %dKB (-%d%%)\n" "$((orig/1024))" "$((new/1024))" "$(( 100 - new*100/orig ))"
fi
echo "=== DONE ==="
