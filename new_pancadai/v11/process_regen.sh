#!/bin/bash
# v11.2.18: 5 張重生成圖 → 無 pad 滿版版（1280 小圖 + 5120 HD webp）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11/assets
NAMES=(hero_sun_2 hero_sun_9 ct_scan_bed dinner_zh_1 dinner_zh_2)
for name in "${NAMES[@]}"; do
  raw="../_gen_v11/${name}_raw.jpg"
  [ -f "$raw" ] || { echo "skip $name (無 raw)"; continue; }
  echo "=== [$name] 後處理 $(date '+%H:%M:%S') ==="
  # 無 pad 滿版小圖（1280×720 直接縮放）
  PYTHONPATH= ffmpeg -y -loglevel error -i "$raw" -vf "scale=1280:720:flags=lanczos" -q:v 2 "${name}_safe.jpg"
  # HD webp（5120 原尺寸）
  PYTHONPATH= ffmpeg -y -loglevel error -i "$raw" -c:v libwebp -quality 82 -compression_level 6 "${name}_safe_hd.webp"
  echo "  ✓ ${name}_safe.jpg + ${name}_safe_hd.webp"
done
echo "=== REGEN PROCESS DONE $(date '+%H:%M:%S') ==="
touch .regen_done
ls -la hero_sun_2_safe.jpg hero_sun_9_safe.jpg ct_scan_bed_safe.jpg dinner_zh_1_safe.jpg dinner_zh_2_safe.jpg 2>/dev/null
