#!/bin/bash
# v11.2: 10 張新圖安全版處理 + SeedVR2 HD 放大（兩階段 2x → 5120×2880）
# 依序執行勿並行；HD 很慢（背景執行），safe jpg 先就緒即可上線
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11/assets
UP="$HOME/.local/bin/mflux-upscale-seedvr2"

for i in $(seq 1 10); do
  n="$i"
  raw="_gen_v11/hero_sun_${n}_raw.jpg"
  [ -f "$raw" ] || { echo "skip $raw (不存在)"; continue; }
  safe="hero_sun_${n}_safe.jpg"
  if [ ! -f "$safe" ]; then
    echo "=== [$n/10] safe 版 $(date '+%H:%M:%S') ==="
    ffmpeg -y -i "$raw" -filter_complex \
"[0:v]split=2[bg][fg];[bg]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=30:4[bgblur];\
[fg]scale=1408:792[fgsc];[bgblur][fgsc]overlay=(W-w)/2:(H-h)/2,scale=1280:720,format=yuv420p" \
-frames:v 1 "$safe"
  fi
done
echo "=== SAFE ALL DONE $(date '+%H:%M:%S') ==="

# HD：SeedVR2 兩階段（1280×720 → 2560×1440 → 5120×2880）
for i in $(seq 1 10); do
  n="$i"
  safe="hero_sun_${n}_safe.jpg"
  hd="hero_sun_${n}_safe_hd.webp"
  [ -f "$safe" ] || continue
  if [ -f "$hd" ]; then echo "[$n/10] HD 已有，跳過"; continue; fi
  echo "=== [$n/10] HD 階段1 (2560) $(date '+%H:%M:%S') ==="
  PYTHONPATH= "$UP" --image-path "$safe" --resolution 2x --output _tmp_hd1.jpg 2>&1 | tail -1
  echo "=== [$n/10] HD 階段2 (5120) $(date '+%H:%M:%S') ==="
  PYTHONPATH= "$UP" --image-path _tmp_hd1.jpg --resolution 2x --output "$hd" 2>&1 | tail -1
  rm -f _tmp_hd1.jpg
done
echo "=== HD ALL DONE $(date '+%H:%M:%S') ==="
ls -la hero_sun_*_safe.jpg hero_sun_*_safe_hd.webp | tail -22
