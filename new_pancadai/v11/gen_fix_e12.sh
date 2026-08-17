#!/bin/bash
# v11.2.24：E1/E2 v3（更溫馨 + 畫面僅一張桌子）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11
mkdir -p _gen_v11
MFX="$HOME/.local/bin/mflux-generate-z-image-turbo"

declare -a NAMES=(dinner_zh_1 dinner_zh_2)
declare -a PROMPTS=(
"Cozy warm family dinner scene in Taiwan, ONE single round dining table only in the frame, on the LEFT side of the table sits a 30-year-old Taiwanese man smiling warmly at his family, steaming Taiwanese dishes on the table, soft warm golden lighting, intimate homey atmosphere, joyful family bonding, photorealistic, wide 16:9 composition"
"Cozy warm family dinner scene in Taiwan, ONE single round dining table only in the frame, a family of four: father and mother with one boy child and one girl child sitting closely together around the table, steaming Taiwanese dishes, soft warm golden home lighting, intimate loving atmosphere, everyone smiling, photorealistic, wide 16:9 composition"
)

for i in "${!NAMES[@]}"; do
  name="${NAMES[$i]}"; prompt="${PROMPTS[$i]}"
  raw="_gen_v11/${name}_v3_raw.jpg"
  [ -f "$raw" ] && { echo "✅ [$name] 已有"; continue; }
  attempt=0
  while [ $attempt -lt 3 ]; do
    attempt=$((attempt+1))
    echo "=== [$name] 嘗試 $attempt/3 $(date '+%H:%M:%S') ==="
    PYTHONPATH= "$MFX" --output "$raw" --width 2560 --height 1440 --steps 4 --seed $RANDOM --prompt "$prompt" > "_gen_v11/${name}_v3.log" 2>&1 &
    MPID=$!
    while kill -0 $MPID 2>/dev/null; do
      sleep 30
      [ -f "$raw" ] && break
      mt=$(stat -f %m "_gen_v11/${name}_v3.log" 2>/dev/null || echo 0)
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
echo "=== E1E2 V3 DONE $(date '+%H:%M:%S') ==="
ls -la _gen_v11/dinner_zh_1_v3_raw.jpg _gen_v11/dinner_zh_2_v3_raw.jpg 2>/dev/null | awk '{print $9, $5}'
