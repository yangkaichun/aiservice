#!/bin/bash
# ip 頁三語擬真圖（科技護城河意象）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11
MFX="$HOME/.local/bin/mflux-generate-z-image-turbo"
mkdir -p _gen_v11/ipmoat

declare -a NAMES=(moat_zh moat_en moat_ja)
PROMPT="Photorealistic scene representing a technology moat built on patents: a modern bright R&D laboratory with a large glass wall, stacks of patent documents and technical drawings on a sleek table, advanced medical AI imaging screens glowing in the background, soft daylight, deep blue and warm orange accents, protective fortress-like atmosphere, no text no words no readable documents, wide 16:9 composition, space at top for UI"

for name in "${NAMES[@]}"; do
  raw="_gen_v11/ipmoat/${name}_raw.jpg"
  [ -f "$raw" ] && { echo "✅ [$name] 已有"; continue; }
  attempt=0
  while [ $attempt -lt 3 ]; do
    attempt=$((attempt+1))
    echo "=== [$name] 嘗試 $attempt $(date '+%H:%M:%S') ==="
    PYTHONPATH= "$MFX" --output "$raw" --width 2560 --height 1440 --steps 4 --seed $((RANDOM*2)) --prompt "$PROMPT" > "_gen_v11/ipmoat/${name}.log" 2>&1 &
    MPID=$!
    while kill -0 $MPID 2>/dev/null; do
      sleep 30
      [ -f "$raw" ] && break
      mt=$(stat -f %m "_gen_v11/ipmoat/${name}.log" 2>/dev/null || echo 0)
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
for name in moat_zh moat_en moat_ja; do
  raw="../_gen_v11/ipmoat/${name}_raw.jpg"
  [ -f "$raw" ] || continue
  PYTHONPATH= /usr/bin/python3 -c "
from PIL import Image
im = Image.open('$raw').convert('RGB')
im.resize((1280, int(1280*im.height/im.width)), Image.LANCZOS).save('${name}_safe.jpg', quality=88)
im.save('${name}_safe_hd.webp', 'WEBP', quality=84, method=6)
w=640; h=int(640*im.height/im.width)
im.resize((w,h), Image.LANCZOS).save('${name}_safe_640.webp', 'WEBP', quality=75, method=6)
print('OK ${name}')
"
done
echo "=== IP MOAT DONE ==="
