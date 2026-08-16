#!/bin/bash
# v11.2.24：4 張圖修改（A16/E1/E2/D1）——2560×1440 產線
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11
mkdir -p _gen_v11
MFX="$HOME/.local/bin/mflux-generate-z-image-turbo"

declare -a NAMES=(hero_sun_9 dinner_zh_1 dinner_zh_2 ct_scan_bed)
declare -a PROMPTS=(
"Taiwanese people enjoying a sunny day in a park by a river in Taipei, on the RIGHT side of the frame an adult MAN and an adult WOMAN walking together and smiling, family-friendly everyday Taiwan scenery, lush green trees, bright daylight, photorealistic, wide 16:9 composition, heads fully visible with space at top"
"Warm family dinner scene in Taiwan, a round table with Taiwanese dishes, on the LEFT side of the frame sits a 30-year-old Taiwanese man smiling, other family members around the table, cozy warm restaurant lighting, photorealistic, wide 16:9 composition"
"Warm family dinner scene in Taiwan, a round table with Taiwanese dishes, a family of four: father and mother with one boy child and one girl child sitting together around the table, cozy warm home dining lighting, photorealistic, wide 16:9 composition"
"Photorealistic scene inside a modern hospital CT scan room: a patient lying perfectly FLAT on their back on the CT scanner bed, body straight, arms at sides, head resting directly on the flat bed surface with NO pillow and NO headrest whatsoever, completely flat head position, the large ring-shaped CT gantry positioned above the patient's abdomen, soft clinical lighting, clean medical environment, wide 16:9 composition"
)

for i in "${!NAMES[@]}"; do
  name="${NAMES[$i]}"; prompt="${PROMPTS[$i]}"
  raw="_gen_v11/${name}_v2_raw.jpg"
  [ -f "$raw" ] && { echo "✅ [$name] 已有"; continue; }
  attempt=0
  while [ $attempt -lt 3 ]; do
    attempt=$((attempt+1))
    echo "=== [$name] 嘗試 $attempt/3 $(date '+%H:%M:%S') ==="
    PYTHONPATH= "$MFX" --output "$raw" --width 2560 --height 1440 --steps 4 --seed $RANDOM --prompt "$prompt" > "_gen_v11/${name}_v2.log" 2>&1 &
    MPID=$!
    while kill -0 $MPID 2>/dev/null; do
      sleep 30
      [ -f "$raw" ] && break
      mt=$(stat -f %m "_gen_v11/${name}_v2.log" 2>/dev/null || echo 0)
      now=$(date +%s); age=$((now - mt))
      if [ $age -gt 240 ]; then
        echo "  ⚠️ [$name] 卡住（log ${age}s）→ kill 重試"
        kill $MPID 2>/dev/null; pkill -P $MPID 2>/dev/null; sleep 2
        rm -f "$raw"
        break
      fi
    done
    [ -f "$raw" ] && { echo "  ✓ [$name] 完成"; break; }
  done
done
echo "=== FIX4 GEN DONE $(date '+%H:%M:%S') ==="
ls -la _gen_v11/hero_sun_9_v2_raw.jpg _gen_v11/dinner_zh_1_v2_raw.jpg _gen_v11/dinner_zh_2_v2_raw.jpg _gen_v11/ct_scan_bed_v2_raw.jpg 2>/dev/null | awk '{print $9, $5}'
