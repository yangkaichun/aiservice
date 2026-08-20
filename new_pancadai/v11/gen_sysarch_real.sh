#!/bin/bash
# v11.2.26：系統架構章節背景圖——擬真示意 4 變體（無文字）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11
MFX="$HOME/.local/bin/mflux-generate-z-image-turbo"
mkdir -p _gen_v11/sysarch

declare -a NAMES=(sysarch_r1 sysarch_r2 sysarch_r3 sysarch_r4)
declare -a PROMPTS=(
"Photorealistic scene inside a modern hospital radiology reading room at warm morning light: a radiologist in white coat reviewing medical images on a large monitor, soft golden sunlight through window blinds, clean high-tech medical environment, calm professional atmosphere, no text no words no signage, warm blue and orange tones, wide 16:9 composition, space at top for UI"
"Photorealistic scene of a bright modern hospital interior lobby with warm morning sunlight streaming through glass walls, clean white and light-blue design, subtle orange accents, a few people walking softly, high-end medical facility feel, calm welcoming atmosphere, no text no words no signage, warm tones, wide 16:9 composition, space at top for UI"
"Photorealistic scene of a medical team discussing a patient case in a modern hospital meeting room: two doctors and a nurse looking at a screen showing medical imaging, warm daylight from large windows, professional yet warm atmosphere, clean modern healthcare environment, no text no words no signage, warm blue tones, wide 16:9 composition, space at top for UI"
"Photorealistic scene of a modern hospital building exterior at golden sunrise, glass facade reflecting warm morning light, a calm street with a few trees, clean architectural photography style, medical institution blending into the city, no text no words no signage, warm golden and blue tones, wide 16:9 composition, space at top for UI"
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
echo "=== SYSARCH REAL 4 VARIANTS DONE $(date '+%H:%M:%S') ==="
ls -la _gen_v11/sysarch/sysarch_r*_raw.jpg 2>/dev/null | awk '{print $9, $5}'
