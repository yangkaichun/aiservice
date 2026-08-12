#!/bin/bash
# v8 素材重建（新 hero_main / bg_reading）：安全版圖 → HD → hero 影片
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v8

echo "=== 1. hero_main 安全版圖 ==="
cd assets/v8gen
ffmpeg -y -i hero_main.jpg -filter_complex \
"[0:v]split=2[bg][fg];[bg]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=30:4[bgblur];\
[fg]scale=1690:946[fgsc];[bgblur][fgsc]overlay=(W-w)/2:(H-h)/2,format=yuv420p" \
-frames:v 1 hero_main_safe.jpg 2>&1 | tail -1

echo "=== 2. hero HD（SeedVR2 2x）==="
PYTHONPATH= ~/.local/bin/mflux-upscale-seedvr2 --image-path hero_main_safe.jpg --resolution 2x --output hero_main_hd.jpg 2>&1 | tail -1

echo "=== 3. hero 影片重製 ==="
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v8
ffmpeg -y -i assets/v8gen/hero_main.jpg -filter_complex \
"[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='1.04+0.04*sin(2*PI*in/288)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=288:s=1920x1080:fps=24,format=yuv420p" \
-c:v libx264 -crf 26 -preset slow -movflags +faststart -t 12 video/hero_main.mp4 2>&1 | tail -1
ffmpeg -y -i assets/v8gen/hero_main.jpg -filter_complex \
"[0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,zoompan=z='1.04+0.04*sin(2*PI*in/288)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=288:s=1280x720:fps=24,format=yuv420p" \
-c:v libvpx-vp9 -crf 40 -b:v 0 -t 12 video/hero_main.webm 2>&1 | tail -1

echo "=== DONE ==="
ls -la video/hero_main.* assets/v8gen/hero_main_safe.jpg assets/v8gen/hero_main_hd.jpg
