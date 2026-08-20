#!/bin/bash
# v11.2.26：系統架構圖 4 變體（全英文、無亂碼強化）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11
MFX="$HOME/.local/bin/mflux-generate-z-image-turbo"
mkdir -p _gen_v11/sysarch

declare -a NAMES=(sysarch_v1 sysarch_v2 sysarch_v3 sysarch_v4)
declare -a PROMPTS=(
"Modern medical AI product illustration, abstract radar-style target lock ring in the center locking onto a small glowing orange dot, concentric blue scanning waves radiating outward, around it four clean nodes with crisp perfectly-spelled English labels: CT Scan, AI Analysis, Lesion Detected, Doctor Alert, connected by smooth glowing lines with small icons, dark navy blue background, blue and orange brand accents, clean flat vector style, ALL TEXT IS PERFECT ENGLISH with no typos no gibberish no random characters, wide 16:9 composition"
"Modern medical AI product illustration, horizontal workflow of four large cards from left to right with clean icons and crisp perfectly-spelled English labels: CT Scan, AI Analysis, Lesion Detected, Doctor Alert, connected by glowing arrows, a subtle glowing pancreas outline behind, dark navy blue background, blue and orange brand accents, clean flat vector style, ALL TEXT IS PERFECT ENGLISH with no typos no gibberish no random characters, wide 16:9 composition"
"Modern medical AI product illustration, a glowing shield emblem in the center with a checkmark and a crosshair lock, surrounded by four certification badges with crisp perfectly-spelled English labels: FDA Breakthrough, TFDA Approved, PACS Integrated, HIPAA Ready, dark navy blue background, blue and orange brand accents, clean flat vector style, ALL TEXT IS PERFECT ENGLISH with no typos no gibberish no random characters, wide 16:9 composition"
"Modern medical AI product illustration, a large central hexagonal AI chip icon with scanning beams, surrounded by four data cards with clean icons and crisp perfectly-spelled English labels: Real-time Analysis, Lesion Marking, PACS Alert, Structured Report, dark navy blue background, blue and orange brand accents, clean flat vector style, ALL TEXT IS PERFECT ENGLISH with no typos no gibberish no random characters, wide 16:9 composition"
)

for i in "${!NAMES[@]}"; do
  name="${NAMES[$i]}"; prompt="${PROMPTS[$i]}"
  raw="_gen_v11/sysarch/${name}_raw.jpg"
  [ -f "$raw" ] && { echo "✅ [$name] 已有"; continue; }
  attempt=0
  while [ $attempt -lt 3 ]; do
    attempt=$((attempt+1))
    echo "=== [$name] 嘗試 $attempt/3 $(date '+%H:%M:%S') ==="
    PYTHONPATH= "$MFX" --output "$raw" --width 2560 --height 1440 --steps 4 --seed $((RANDOM*2)) --prompt "$prompt" > "_gen_v11/sysarch/${name}.log" 2>&1 &
    MPID=$!
    while kill -0 $MPID 2>/dev/null; do
      sleep 30
      [ -f "$raw" ] && break
      mt=$(stat -f %m "_gen_v11/sysarch/${name}.log" 2>/dev/null || echo 0)
      now=$(date +%s); age=$((now - mt))
      if [ $age -gt 240 ]; then
        echo "  ⚠️ [$name] 卡住 → kill 重試"
        kill $MPID 2>/dev/null; pkill -P $MPID 2>/dev/null; sleep 2
        rm -f "$raw"
        break
      fi
    done
    [ -f "$raw" ] && { echo "  ✓ [$name] 完成"; break; }
  done
done
echo "=== SYSARCH 4 VARIANTS DONE $(date '+%H:%M:%S') ==="
ls -la _gen_v11/sysarch/*_raw.jpg 2>/dev/null | awk '{print $9, $5}'
