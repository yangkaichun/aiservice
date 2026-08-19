#!/bin/bash
# v8 hero_main 重製 v2 — 以真實腹部 CT（ct_slice.png）為基底圖生圖
# 參考：真實腹部 CT 軸向切片 = 灰階、黑底、脊椎亮白、器官中灰、PACS 閱片螢幕
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v8/assets

GEN=~/.local/bin/mflux-generate-z-image-turbo

echo "=== hero_main v2：真實 CT 為基底 + 戰情室 ==="
PYTHONPATH= $GEN \
  --image-path ct_slice.png \
  --image-strength 0.55 \
  --prompt "An authentic grayscale abdominal CT axial slice (monochrome cross-section of the human torso, black background, bright white spine and ribs, gray organs) displayed full-screen on a large medical PACS monitor inside a dark radiology command center, deep navy blue ambient lighting, a subtle cyan scan line sweeping horizontally across the monitor, one small orange AI detection reticle frame around the pancreas area, photorealistic, cinematic moody, high-tech medical AI atmosphere, the CT image itself must remain grayscale and realistic, no text, no watermark" \
  --width 1600 --height 900 --steps 9 -q 8 --seed 4001 \
  --output v8gen/hero_main.jpg 2>&1 | tail -3

echo "=== DONE ==="
ls -la v8gen/hero_main*.jpg
