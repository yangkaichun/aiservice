#!/bin/bash
# v11.2.18 supervised：5 張重生成，每張內建監控（30 秒檢查 CPU，連續 60 秒無運算→kill 重試，最多 3 次）
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11 || exit 1
mkdir -p _gen_v11
MFX="$HOME/.local/bin/mflux-generate-z-image-turbo"

declare -a NAMES=(hero_sun_2 hero_sun_9 ct_scan_bed dinner_zh_1 dinner_zh_2)
declare -a PROMPTS=(
"A young Taiwanese woman sitting by a bright window in a cozy Taipei coffee shop, morning sunlight streaming in, she holds a coffee cup in her raised hand near her lips, the table in front of her is clean with only a book and her phone, NO other coffee cups on the table, warm golden morning tones, photorealistic, wide 16:9 composition, subject slightly right of center, space at top for UI"
"Taiwanese people enjoying a sunny day in a park by a river in Taipei, an adult woman on the RIGHT side of the frame walking and smiling, family-friendly everyday Taiwan scenery, lush green trees, bright daylight, photorealistic, wide 16:9 composition, heads fully visible with space at top"
"Photorealistic scene inside a modern hospital CT scan room: a patient lying FLAT on their back on the CT scanner bed, body straight, arms at sides, head resting directly on the flat bed with NO pillow and NO headrest, the large ring-shaped CT gantry positioned above the patient's abdomen, soft clinical lighting, clean medical environment, wide 16:9 composition"
"Warm family dinner scene in Taiwan, a round table with Taiwanese dishes, on the LEFT side of the frame sits a 60-year-old Taiwanese woman with grey-streaked hair wearing a warm smile, other family members around the table, cozy warm restaurant lighting, photorealistic, wide 16:9 composition"
"Warm family dinner scene in Taiwan, a round table with Taiwanese dishes, on the LEFT side of the frame sits a 30-year-old Taiwanese woman smiling, only ADULTS at the table no children, cozy warm home dining lighting, photorealistic, wide 16:9 composition"
)

for i in "${!NAMES[@]}"; do
  name="${NAMES[$i]}"; prompt="${PROMPTS[$i]}"
  raw="_gen_v11/${name}_raw.jpg"
  [ -f "$raw" ] && { echo "✅ [$name] 已有 raw，跳過"; continue; }
  attempt=0
  while [ $attempt -lt 3 ]; do
    attempt=$((attempt+1))
    echo "=== [$name] 嘗試 $attempt/3 $(date '+%H:%M:%S') ==="
    PYTHONPATH= "$MFX" --output "$raw" --width 2560 --height 1440 --steps 4 --seed $RANDOM --prompt "$prompt" > "_gen_v11/${name}.log" 2>&1 &
    MPID=$!
    idle=0; done_flag=0
    while kill -0 $MPID 2>/dev/null; do
      sleep 30
      [ -f "$raw" ] && { done_flag=1; break; }
      # 卡住判斷：log 檔案超過 180 秒無更新（tqdm 每 step 寫入；Metal GPU 運算 CPU% 不可靠）
      mt=$(stat -f %m "_gen_v11/${name}.log" 2>/dev/null || echo 0)
      now=$(date +%s)
      age=$((now - mt))
      if [ $age -gt 180 ]; then
        echo "  ⚠️ [$name] 卡住（log ${age}s 無更新）→ kill 重試"
        kill $MPID 2>/dev/null; pkill -P $MPID 2>/dev/null; sleep 2
        rm -f "$raw"
        break
      fi
    done
    if [ -f "$raw" ]; then
      sz=$(sips -g pixelWidth "$raw" 2>/dev/null | awk '/pixelWidth/{print $2}')
      echo "  ✓ [$name] 完成 ${sz}px $(date '+%H:%M:%S')"
      break
    fi
  done
  [ -f "$raw" ] || echo "  ❌ [$name] 3 次嘗試失敗"
done
touch assets/.regen_done
echo "=== SUPERVISED REGEN ALL DONE $(date '+%H:%M:%S') ==="
ls -la _gen_v11/hero_sun_2_raw.jpg _gen_v11/hero_sun_9_raw.jpg _gen_v11/ct_scan_bed_raw.jpg _gen_v11/dinner_zh_1_raw.jpg _gen_v11/dinner_zh_2_raw.jpg 2>/dev/null
