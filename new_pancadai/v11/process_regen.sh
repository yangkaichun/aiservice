#!/bin/bash
# v11.2.18 後處理：2560 raw → SeedVR2 5120 HD webp + 1280 滿版小圖
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11/assets
UP="$HOME/.local/bin/mflux-upscale-seedvr2"
NAMES=(hero_sun_2 hero_sun_9 ct_scan_bed dinner_zh_1 dinner_zh_2)
for name in "${NAMES[@]}"; do
  raw="../_gen_v11/${name}_raw.jpg"
  [ -f "$raw" ] || { echo "skip $name (無 raw)"; continue; }
  echo "=== [$name] SeedVR2 5120 $(date '+%H:%M:%S') ==="
  PYTHONPATH= "$UP" --image-path "$raw" --resolution 2x --output "${name}_safe_hd.webp" 2>&1 | tail -1
  echo "  ✓ HD webp"
  # 1280 滿版小圖（無 pad）
  PYTHONPATH= ffmpeg -y -loglevel error -i "$raw" -vf "scale=1280:720:flags=lanczos" -q:v 2 "${name}_safe.jpg"
  echo "  ✓ 1280 小圖"
done
echo "=== REGEN PROCESS DONE $(date '+%H:%M:%S') ==="
touch .regen_done
ls -la hero_sun_2_safe.jpg hero_sun_9_safe.jpg ct_scan_bed_safe.jpg dinner_zh_1_safe.jpg dinner_zh_2_safe.jpg *_hd.webp 2>/dev/null | tail -6
