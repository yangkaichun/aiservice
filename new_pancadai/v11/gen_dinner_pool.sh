#!/bin/bash
# v11.2: 幕7「晚餐桌上全家都在」語言專屬擬真圖（zh 亞裔2 + ja 亞裔2 + en 西歐2）
# 依序執行（接在 CT 圖之後）；每張 → 安全版 1280×720；HD 由 process 階段補
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11/assets
GEN="$HOME/.local/bin/mflux-generate-z-image-turbo"
COMMON="--model z-image-turbo --width 1600 --height 900 --steps 9 --guidance 4.5"

declare -a NAMES=(dinner_zh_1 dinner_zh_2 dinner_ja_1 dinner_ja_2 dinner_en_1 dinner_en_2)
declare -a PROMPTS=(
  "Photorealistic warm photograph, three-generation Taiwanese family having dinner together at a round table with Chinese dishes, hot pot steam rising, warm cozy home lighting, elderly grandparents and parents and a young child, genuine happy smiles, intimate family atmosphere, no text, no watermark, 16:9 wide"
  "Photorealistic warm photograph, Taiwanese family of four having dinner at home, parents and two children, Taiwanese home-cooked dishes on the table, warm lamp light, joyful conversation, genuine smiles, cozy modern Taiwanese home interior, no text, no watermark, 16:9 wide"
  "Photorealistic warm photograph, Japanese family having dinner together at a low traditional table with Japanese dishes (miso soup, rice, grilled fish), warm lighting, tatami room, parents and grandmother with a child, genuine warm smiles, intimate atmosphere, no text, no watermark, 16:9 wide"
  "Photorealistic warm photograph, Japanese family of four eating dinner in a bright modern Japanese home dining room, Japanese cuisine on the table, warm evening light through window, parents and two children laughing, genuine smiles, no text, no watermark, 16:9 wide"
  "Photorealistic warm photograph, Western European family having dinner at a long wooden table with candles and warm pendant light, roast chicken and salad, blonde parents and two children, genuine joyful smiles, cozy European home interior, no text, no watermark, 16:9 wide"
  "Photorealistic warm photograph, diverse Western family (white father, mixed-race mother, two children) having dinner in a bright Scandinavian-style kitchen, warm evening light, healthy meal on table, genuine happy laughter, cozy modern European interior, no text, no watermark, 16:9 wide"
)

mkdir -p _gen_v11
for i in "${!NAMES[@]}"; do
  name="${NAMES[$i]}"
  out="_gen_v11/${name}_raw.jpg"
  if [ -f "$out" ] && [ -s "$out" ]; then echo "[$name] skip"; continue; fi
  echo "=== [$name] generating... $(date '+%H:%M:%S') ==="
  PYTHONPATH= "$GEN" $COMMON --seed $((5000 + i * 53)) --prompt "${PROMPTS[$i]}" --output "$out"
  # 安全版（×0.88 blur-pad）
  ffmpeg -y -i "$out" -filter_complex \
"[0:v]split=2[bg][fg];[bg]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=30:4[bgblur];\
[fg]scale=1408:792[fgsc];[bgblur][fgsc]overlay=(W-w)/2:(H-h)/2,scale=1280:720,format=yuv420p" \
-frames:v 1 "${name}_safe.jpg"
  echo "=== [$name] done $(date '+%H:%M:%S') ==="
done
echo "=== DINNER ALL DONE $(date '+%H:%M:%S') ==="
ls -la dinner_*_safe.jpg
