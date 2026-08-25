#!/bin/bash
# 幕 7：以 D4（dinner_en_1）為底換亞裔面孔（zh/ja 版）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11
MFX="$HOME/.local/bin/mflux-generate-z-image-turbo"
mkdir -p _gen_v11/dinner
raw="_gen_v11/dinner/dinner_en1_asia_raw.jpg"
[ -f "$raw" ] && { echo "已有"; exit 0; }
attempt=0
while [ $attempt -lt 3 ]; do
  attempt=$((attempt+1))
  echo "=== 嘗試 $attempt $(date '+%H:%M:%S') ==="
  PYTHONPATH= "$MFX" --output "$raw" --prompt "Replace every person in this exact scene with East Asian family members, keep the exact same scene composition, dinner table, food, background, lighting and setting unchanged, photorealistic, natural warm light, no text no words" --image-path assets/dinner_en_1_safe.jpg --image-strength 0.55 --width 2560 --height 1440 --steps 6 -q 8 --seed $((RANDOM*2)) > "_gen_v11/dinner/dinner_en1_asia.log" 2>&1 &
  MPID=$!
  while kill -0 $MPID 2>/dev/null; do
    sleep 30
    [ -f "$raw" ] && break
    mt=$(stat -f %m "_gen_v11/dinner/dinner_en1_asia.log" 2>/dev/null || echo 0)
    age=$(($(date +%s) - mt))
    if [ $age -gt 240 ]; then
      echo "  ⚠️ 卡住→重試"; kill $MPID 2>/dev/null; pkill -P $MPID 2>/dev/null; sleep 2
      rm -f "$raw"; break
    fi
  done
  [ -f "$raw" ] && { echo "  ✓ 完成"; break; }
done
cd assets
PYTHONPATH= /usr/bin/python3 -c "
from PIL import Image
im = Image.open('../$raw').convert('RGB')
im.resize((1280, int(1280*im.height/im.width)), Image.LANCZOS).save('dinner_en1_asia_safe.jpg', quality=88)
im.save('dinner_en1_asia_safe_hd.webp', 'WEBP', quality=84, method=6)
w=640; h=int(640*im.height/im.width)
im.resize((w,h), Image.LANCZOS).save('dinner_en1_asia_safe_640.webp', 'WEBP', quality=75, method=6)
print('OK dinner_en1_asia', im.size)
"
echo "=== DONE ==="
