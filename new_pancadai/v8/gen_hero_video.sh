#!/bin/bash
# v8 hero 滿版影片：hero_compare_premium 基底，zoompan 左右來回掃描（sin 無縫 loop）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v8

SRC=assets/v8gen/hero_compare_premium.jpg
# 12s @24fps = 288 幀；z=1.18 放大，x 依 sin 左右掃（in=0 最左 → 中 → 最右 → 中 → 回最左）
ZOOM="z='1.18':x='(iw-iw/zoom)*0.5*(1+sin(2*PI*in/288-PI/2))':y='ih/2-(ih/zoom/2)':d=288:s=1920x1080:fps=24"

echo "=== MP4 (1080p) ==="
ffmpeg -y -i "$SRC" -vf "zoompan=${ZOOM},format=yuv420p" \
  -c:v libx264 -crf 26 -preset slow -movflags +faststart -t 12 video/hero_main.mp4 2>&1 | tail -1

echo "=== WebM (720p) ==="
ffmpeg -y -i "$SRC" -vf "zoompan=z='1.18':x='(iw-iw/zoom)*0.5*(1+sin(2*PI*in/288-PI/2))':y='ih/2-(ih/zoom/2)':d=288:s=1280x720:fps=24,format=yuv420p" \
  -c:v libvpx-vp9 -crf 40 -b:v 0 -t 12 video/hero_main.webm 2>&1 | tail -1

ls -la video/hero_main.*
echo "=== DONE ==="
