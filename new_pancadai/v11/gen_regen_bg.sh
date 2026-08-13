#!/bin/bash
# v11.2.18: 5 張背景圖重生成（滿版無 pad，5120×2880）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11
mkdir -p _gen_v11

gen() { # name prompt
  local name="$1"; shift
  echo "=== [$name] 生成 $(date '+%H:%M:%S') ==="
  PYTHONPATH= mflux-generate-z-image-turbo --output "_gen_v11/${name}_raw.jpg" \
    --width 5120 --height 2880 --steps 4 --seed $RANDOM --prompt "$*" 2>&1 | tail -2
}

gen hero_sun_2 "A young Taiwanese woman sitting by a bright window in a cozy Taipei coffee shop, morning sunlight streaming in, she holds a coffee cup in her raised hand near her lips, the table in front of her is clean with only a book and her phone, NO other coffee cups on the table, warm golden morning tones, photorealistic, wide 16:9 composition, subject slightly right of center, space at top for UI"

gen hero_sun_9 "Taiwanese people enjoying a sunny day in a park by a river in Taipei, an adult woman on the RIGHT side of the frame walking and smiling, family-friendly everyday Taiwan scenery, lush green trees, bright daylight, photorealistic, wide 16:9 composition, heads fully visible with space at top"

gen ct_scan_bed "Photorealistic scene inside a modern hospital CT scan room: a patient lying FLAT on their back on the CT scanner bed, body straight, arms at sides, head resting directly on the flat bed with NO pillow and NO headrest, the large ring-shaped CT gantry positioned above the patient's abdomen, soft clinical lighting, clean medical environment, wide 16:9 composition"

gen dinner_zh_1 "Warm family dinner scene in Taiwan, a round table with Taiwanese dishes, on the LEFT side of the frame sits a 60-year-old Taiwanese woman with grey-streaked hair wearing a warm smile, other family members around the table, cozy warm restaurant lighting, photorealistic, wide 16:9 composition"

gen dinner_zh_2 "Warm family dinner scene in Taiwan, a round table with Taiwanese dishes, on the LEFT side of the frame sits a 30-year-old Taiwanese woman smiling, only ADULTS at the table (no children), cozy warm home dining lighting, photorealistic, wide 16:9 composition"

echo "=== ALL REGEN DONE $(date '+%H:%M:%S') ==="
ls -la _gen_v11/hero_sun_2_raw.jpg _gen_v11/hero_sun_9_raw.jpg _gen_v11/ct_scan_bed_raw.jpg _gen_v11/dinner_zh_1_raw.jpg _gen_v11/dinner_zh_2_raw.jpg 2>/dev/null
