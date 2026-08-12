#!/bin/bash
# v8 安全版圖製作（ffmpeg blur-pad，×0.88 防 nav 切人物）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v8/assets/v8gen

for img in hero_main hero_intl; do
  echo "=== $img ==="
  ffmpeg -y -i ${img}.jpg -filter_complex \
"[0:v]split=2[bg][fg];[bg]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=30:4[bgblur];\
[fg]scale=1690:946[fgsc];[bgblur][fgsc]overlay=(W-w)/2:(H-h)/2,format=yuv420p" \
-frames:v 1 ${img}_safe.jpg 2>&1 | tail -1
  sips -g pixelWidth -g pixelHeight ${img}_safe.jpg | grep pixel | awk '{print $2}' | paste -sd'x' - | xargs echo "  size:"
done
echo "DONE"
