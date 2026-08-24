#!/bin/bash
# 幕 8 星空圖生成（夜晚陽台看星星）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11
MFX="$HOME/.local/bin/mflux-generate-z-image-turbo"
raw="_gen_v11/balcony_stars_raw.jpg"
[ -f "$raw" ] && { echo "已有"; exit 0; }
attempt=0
while [ $attempt -lt 3 ]; do
  attempt=$((attempt+1))
  echo "=== 嘗試 $attempt $(date '+%H:%M:%S') ==="
  PYTHONPATH= "$MFX" --output "$raw" --width 2560 --height 1440 --steps 4 --seed $RANDOM --prompt "Peaceful night scene: an elderly Asian man standing on a home balcony looking up at a beautiful starry night sky, soft warm light from the living room behind him, city lights twinkling in the distance, deep blue night tones with warm orange accents, calm hopeful atmosphere, photorealistic, wide 16:9 composition, space at top for UI, no text no words" > "_gen_v11/balcony_stars.log" 2>&1 &
  MPID=$!
  while kill -0 $MPID 2>/dev/null; do
    sleep 30
    [ -f "$raw" ] && break
    mt=$(stat -f %m "_gen_v11/balcony_stars.log" 2>/dev/null || echo 0)
    age=$(($(date +%s) - mt))
    if [ $age -gt 240 ]; then
      echo "卡住→重試"; kill $MPID 2>/dev/null; pkill -P $MPID 2>/dev/null; sleep 2
      rm -f "$raw"; break
    fi
  done
  [ -f "$raw" ] && { echo "✓ 完成"; break; }
done
# 轉檔
cd assets
PYTHONPATH= /usr/bin/python3 -c "
from PIL import Image
import os
im = Image.open('../$raw').convert('RGB')
im.resize((1280, int(1280*im.height/im.width)), Image.LANCZOS).save('balcony_stars_safe.jpg', quality=88)
im.save('balcony_stars_safe_hd.webp', 'WEBP', quality=84, method=6)
w=640; h=int(640*im.height/im.width)
im.resize((w,h), Image.LANCZOS).save('balcony_stars_safe_640.webp', 'WEBP', quality=75, method=6)
print('OK balcony_stars', im.size)
"
