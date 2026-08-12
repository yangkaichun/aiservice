#!/bin/bash
# v8 hero 滿版影片製作 — 深藍戰情室版（v7 zoompan 無縫 loop 技術）
# 輸入：assets/v8gen/hero_main.jpg（1600×896）
# 輸出：video/hero_main.mp4 + video/hero_main.webm（<2MB 紅線）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v8
mkdir -p video

SRC=assets/v8gen/hero_main.jpg

# 檢查來源
if [ ! -f "$SRC" ]; then
  echo "ERROR: $SRC 不存在，先跑 gen_v8_assets.sh"
  exit 1
fi

# 12s @24fps = 288 幀；sin 往返縮放（1.04→1.08），loop 點無跳動
echo "=== MP4 (1080p) ==="
ffmpeg -y -i "$SRC" -filter_complex \
"[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='1.04+0.04*sin(2*PI*in/288)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=288:s=1920x1080:fps=24,format=yuv420p" \
-c:v libx264 -crf 26 -preset slow -movflags +faststart -t 12 video/hero_main.mp4

echo "=== WebM (720p) ==="
ffmpeg -y -i "$SRC" -filter_complex \
"[0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,zoompan=z='1.04+0.04*sin(2*PI*in/288)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=288:s=1280x720:fps=24,format=yuv420p" \
-c:v libvpx-vp9 -crf 40 -b:v 0 -t 12 video/hero_main.webm

ls -la video/
echo "=== DONE ==="
