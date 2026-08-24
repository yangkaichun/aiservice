#!/bin/bash
# publications hero 擬真背景圖（2 候選）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11
MFX="$HOME/.local/bin/mflux-generate-z-image-turbo"
mkdir -p _gen_v11/pubev

declare -a NAMES=(pubev_v1 pubev_v2)
declare -a PROMPTS=(
"Photorealistic scene of a modern research library with warm morning light: open medical journals and scientific papers on a wooden table, a laptop showing a chart, soft sunlight through tall windows, scholarly atmosphere, depth of field, warm blue and orange tones, no text no words no signage, wide 16:9 composition, space at top for UI"
"Photorealistic scene of an international medical conference hall: a speaker presenting a scientific poster at the podium, audience of medical professionals, warm stage lighting, modern venue, scholarly atmosphere, no text no words no readable signage, warm tones, wide 16:9 composition, space at top for UI"
)

for i in "${!NAMES[@]}"; do
  name="${NAMES[$i]}"; prompt="${PROMPTS[$i]}"
  raw="_gen_v11/pubev/${name}_raw.jpg"
  [ -f "$raw" ] && { echo "✅ [$name] 已有"; continue; }
  attempt=0
  while [ $attempt -lt 3 ]; do
    attempt=$((attempt+1))
    echo "=== [$name] 嘗試 $attempt $(date '+%H:%M:%S') ==="
    PYTHONPATH= "$MFX" --output "$raw" --width 2560 --height 1440 --steps 4 --seed $((RANDOM*2)) --prompt "$prompt" > "_gen_v11/pubev/${name}.log" 2>&1 &
    MPID=$!
    while kill -0 $MPID 2>/dev/null; do
      sleep 30
      [ -f "$raw" ] && break
      mt=$(stat -f %m "_gen_v11/pubev/${name}.log" 2>/dev/null || echo 0)
      age=$(($(date +%s) - mt))
      if [ $age -gt 240 ]; then
        echo "  ⚠️ 卡住→重試"; kill $MPID 2>/dev/null; pkill -P $MPID 2>/dev/null; sleep 2
        rm -f "$raw"; break
      fi
    done
    [ -f "$raw" ] && { echo "  ✓ 完成"; break; }
  done
done
# 預覽
cd assets
for name in pubev_v1 pubev_v2; do
  raw="../_gen_v11/pubev/${name}_raw.jpg"
  [ -f "$raw" ] || continue
  PYTHONPATH= /usr/bin/python3 -c "
from PIL import Image
im = Image.open('$raw').convert('RGB')
im.resize((1280, int(1280*im.height/im.width)), Image.LANCZOS).save('/tmp/patient_bg/${name}_preview.jpg', quality=88)
"
done
echo "=== PUBEV DONE ==="
