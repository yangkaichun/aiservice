#!/bin/bash
# en 版配圖：以 zh 圖 img2img 換西歐人種（同場景構圖）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11
MFX="$HOME/.local/bin/mflux-generate-z-image-turbo"
mkdir -p _gen_v11/enfix

declare -a NAMES=(coffee_en doctor_en stars_en bike_en dinner_en)
declare -a SRC=(assets/hero_sun_coffee_safe.jpg assets/doctor_discuss_safe.jpg assets/balcony_stars_safe.jpg assets/hero_sun_bike_safe.jpg assets/dinner_ja_1_safe.jpg)
PROMPT="Replace every person in this exact scene with Western European people, keep the exact same scene composition, background, lighting and setting unchanged, photorealistic, natural light, no text no words"

for i in "${!NAMES[@]}"; do
  name="${NAMES[$i]}"; src="${SRC[$i]}"
  raw="_gen_v11/enfix/${name}_raw2.jpg"
  [ -f "$raw" ] && { echo "✅ [$name] 已有"; continue; }
  attempt=0
  while [ $attempt -lt 3 ]; do
    attempt=$((attempt+1))
    echo "=== [$name] 嘗試 $attempt $(date '+%H:%M:%S') ==="
    PYTHONPATH= "$MFX" --output "$raw" --prompt "$PROMPT" --image "$src" --strength 0.55 \
      --width 2560 --height 1440 --steps 6 -q 8 --seed $((RANDOM*2)) > "_gen_v11/enfix/${name}_2.log" 2>&1 &
    MPID=$!
    while kill -0 $MPID 2>/dev/null; do
      sleep 30
      [ -f "$raw" ] && break
      mt=$(stat -f %m "_gen_v11/enfix/${name}_2.log" 2>/dev/null || echo 0)
      age=$(($(date +%s) - mt))
      if [ $age -gt 240 ]; then
        echo "  ⚠️ 卡住→重試"; kill $MPID 2>/dev/null; pkill -P $MPID 2>/dev/null; sleep 2
        rm -f "$raw"; break
      fi
    done
    [ -f "$raw" ] && { echo "  ✓ 完成"; break; }
  done
done
# 轉檔覆蓋 en 版
cd assets
for name in coffee_en doctor_en stars_en; do
  raw="../_gen_v11/enfix/${name}_raw2.jpg"
  [ -f "$raw" ] || continue
  PYTHONPATH= /usr/bin/python3 -c "
from PIL import Image
im = Image.open('$raw').convert('RGB')
im.resize((1280, int(1280*im.height/im.width)), Image.LANCZOS).save('${name}_safe.jpg', quality=88)
im.save('${name}_safe_hd.webp', 'WEBP', quality=84, method=6)
w=640; h=int(640*im.height/im.width)
im.resize((w,h), Image.LANCZOS).save('${name}_safe_640.webp', 'WEBP', quality=75, method=6)
print('OK ${name} (img2img 西歐)')
"
done
# bike_en / dinner_en 也輸出正式名
for pair in "bike_en:hero_sun_bike_en" "dinner_en:dinner_ja_en"; do
  name="${pair%%:*}"; out="${pair#*:}"
  raw="../_gen_v11/enfix/${name}_raw2.jpg"
  [ -f "$raw" ] || continue
  PYTHONPATH= /usr/bin/python3 -c "
from PIL import Image
im = Image.open('$raw').convert('RGB')
im.resize((1280, int(1280*im.height/im.width)), Image.LANCZOS).save('${out}_safe.jpg', quality=88)
im.save('${out}_safe_hd.webp', 'WEBP', quality=84, method=6)
print('OK ${out}')
"
done
echo "=== EN IMG2IMG DONE ==="
