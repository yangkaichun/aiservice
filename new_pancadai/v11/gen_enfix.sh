#!/bin/bash
# en 版西歐固定圖（patient 幕2咖啡/幕5醫師/幕8星空）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11
MFX="$HOME/.local/bin/mflux-generate-z-image-turbo"
mkdir -p _gen_v11/enfix

declare -a NAMES=(coffee_en doctor_en stars_en)
declare -a PROMPTS=(
"Warm morning scene in a European cafe: an elderly European man in his 60s reading a newspaper with a cup of coffee on the wooden table, sunlight through large windows, cozy Western European atmosphere, photorealistic, wide 16:9 composition, no text no words"
"Photorealistic scene in a modern European hospital consultation room: a European doctor in white coat explaining medical images on a screen to an elderly European male patient, warm daylight, professional caring atmosphere, Western European setting, no text no words, wide 16:9 composition"
"Peaceful night scene: an elderly European man standing on a home balcony looking up at a beautiful starry night sky, soft warm light from the living room behind, European city lights twinkling in the distance, deep blue night tones with warm orange accents, calm hopeful atmosphere, photorealistic, wide 16:9 composition, no text no words"
)

for i in "${!NAMES[@]}"; do
  name="${NAMES[$i]}"; prompt="${PROMPTS[$i]}"
  raw="_gen_v11/enfix/${name}_raw.jpg"
  [ -f "$raw" ] && { echo "✅ [$name] 已有"; continue; }
  attempt=0
  while [ $attempt -lt 3 ]; do
    attempt=$((attempt+1))
    echo "=== [$name] 嘗試 $attempt $(date '+%H:%M:%S') ==="
    PYTHONPATH= "$MFX" --output "$raw" --width 2560 --height 1440 --steps 4 --seed $((RANDOM*2)) --prompt "$prompt" > "_gen_v11/enfix/${name}.log" 2>&1 &
    MPID=$!
    while kill -0 $MPID 2>/dev/null; do
      sleep 30
      [ -f "$raw" ] && break
      mt=$(stat -f %m "_gen_v11/enfix/${name}.log" 2>/dev/null || echo 0)
      age=$(($(date +%s) - mt))
      if [ $age -gt 240 ]; then
        echo "  ⚠️ 卡住→重試"; kill $MPID 2>/dev/null; pkill -P $MPID 2>/dev/null; sleep 2
        rm -f "$raw"; break
      fi
    done
    [ -f "$raw" ] && { echo "  ✓ 完成"; break; }
  done
done
# 轉檔
cd assets
for name in coffee_en doctor_en stars_en; do
  raw="../_gen_v11/enfix/${name}_raw.jpg"
  [ -f "$raw" ] || { echo "skip $name"; continue; }
  PYTHONPATH= /usr/bin/python3 -c "
from PIL import Image
im = Image.open('$raw').convert('RGB')
im.resize((1280, int(1280*im.height/im.width)), Image.LANCZOS).save('${name}_safe.jpg', quality=88)
im.save('${name}_safe_hd.webp', 'WEBP', quality=84, method=6)
w=640; h=int(640*im.height/im.width)
im.resize((w,h), Image.LANCZOS).save('${name}_safe_640.webp', 'WEBP', quality=75, method=6)
print('OK ${name}', im.size)
"
done
echo "=== EN FIX DONE ==="
