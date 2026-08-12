#!/bin/bash
# v8 hero 左右對比合成：左=原始 CT，右=PANCREASaver 判讀後
# 輸出 1920×1080（黑底），供網站 hero + 影片用
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v8/assets/v8gen

# 原圖 4000×1859（2.15:1）。各取半邊：左 org、右 seg
# 每半 2000×1859 → 縮放至 960×892（16:9 左右各半的目標）→ hstack 1920×892 → pad 1920×1080 黑底
echo "=== 合成 hero_compare ==="
ffmpeg -y \
  -i ct_org_hd.png -i ct_seg_hd.png \
  -filter_complex "\
[0:v]crop=2000:1859:0:0,scale=960:892[L];\
[1:v]crop=2000:1859:2000:0,scale=960:892[R];\
[L][R]hstack=2,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black,format=yuv420p" \
  -frames:v 1 hero_compare.jpg 2>&1 | tail -1

echo "=== 檢查 ==="
sips -g pixelWidth -g pixelHeight hero_compare.jpg | grep pixel | paste -sd'x' - | xargs echo "size:"
ls -la hero_compare.jpg
