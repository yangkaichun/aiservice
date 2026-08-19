#!/bin/bash
# v11.2.20：17 張有 raw 的圖 → 無 pad 滿版版（1280 小圖 + HD webp）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11/assets
SRC="_gen_v11"
# (目標名, raw 檔)
declare -a JOBS=(
  "hero_sun_1|hero_sun_1_raw.jpg"
  "hero_sun_2|hero_sun_2_raw.jpg"
  "hero_sun_3|hero_sun_3_raw.jpg"
  "hero_sun_4|hero_sun_4_raw.jpg"
  "hero_sun_5|hero_sun_5_raw.jpg"
  "hero_sun_6|hero_sun_6_raw.jpg"
  "hero_sun_7|hero_sun_7_raw.jpg"
  "hero_sun_8|hero_sun_8_raw.jpg"
  "hero_sun_9|hero_sun_9_raw.jpg"
  "hero_sun_10|hero_sun_10_raw.jpg"
  "ct_scan_bed|ct_scan_bed_raw.jpg"
  "dinner_zh_1|dinner_zh_1_raw.jpg"
  "dinner_zh_2|dinner_zh_2_raw.jpg"
  "dinner_ja_1|dinner_ja_1_raw.jpg"
  "dinner_ja_2|dinner_ja_2_raw.jpg"
  "dinner_en_1|dinner_en_1_raw.jpg"
  "dinner_en_2|dinner_en_2_raw.jpg"
)
for job in "${JOBS[@]}"; do
  name="${job%%|*}"; raw="${job#*|}"
  [ -f "$SRC/$raw" ] || { echo "skip $name (無 $raw)"; continue; }
  echo "=== [$name] $(date '+%H:%M:%S') ==="
  PYTHONPATH= ffmpeg -y -loglevel error -i "$SRC/$raw" -vf "scale=1280:720:flags=lanczos" -q:v 2 "${name}_safe.jpg"
  PYTHONPATH= ffmpeg -y -loglevel error -i "$SRC/$raw" -c:v libwebp -quality 82 -compression_level 6 "${name}_safe_hd.webp"
  echo "  ✓ ${name}_safe.jpg + _safe_hd.webp"
done
echo "=== NO-PAD BATCH DONE $(date '+%H:%M:%S') ==="
