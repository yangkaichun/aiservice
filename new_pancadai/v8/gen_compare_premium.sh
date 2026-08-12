#!/bin/bash
# v8 hero 質感合成 v2：左右對比 CT + 深藍漸層（numpy 產） + 柔光 + 分隔線 + 上下遮罩
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v8/assets/v8gen

echo "=== hero_compare_premium ==="
ffmpeg -y \
  -i /tmp/v8_sky.png -i ct_org_hd.png -i ct_seg_hd.png -i /tmp/v8_mask.png \
  -filter_complex "\
[1:v]crop=2000:1859:0:0,scale=700:650[L];\
[2:v]crop=2000:1859:2000:0,scale=700:650[R];\
[0:v][L]overlay=260:215[bg1];\
[bg1][R]overlay=960:215[bg2];\
[bg2]drawbox=x=958:y=140:w=4:h=800:color=0xec7000@0.85:t=fill[bg3];\
[bg3][3:v]overlay=0:0,format=yuv420p" \
  -frames:v 1 hero_compare_premium.jpg 2>&1 | tail -1

sips -g pixelWidth -g pixelHeight hero_compare_premium.jpg | grep pixel | paste -sd'x' - | xargs echo "size:"
ls -la hero_compare_premium.jpg
