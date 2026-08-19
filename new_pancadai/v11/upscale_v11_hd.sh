#!/bin/bash
# v11.2: 全部新圖 HD 放大（SeedVR2 兩階段 → 5120×2880 webp）
# 依序執行勿並行；背景執行（很慢）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11/assets
UP="$HOME/.local/bin/mflux-upscale-seedvr2"

declare -a NAMES=(hero_sun_1 hero_sun_2 hero_sun_3 hero_sun_4 hero_sun_5 hero_sun_6 hero_sun_7 hero_sun_8 hero_sun_9 hero_sun_10 ct_scan_bed dinner_zh_1 dinner_zh_2 dinner_ja_1 dinner_ja_2 dinner_en_1 dinner_en_2)

for name in "${NAMES[@]}"; do
  safe="${name}_safe.jpg"
  hd="${name}_safe_hd.webp"
  [ -f "$safe" ] || { echo "skip $safe (無)"; continue; }
  if [ -f "$hd" ]; then echo "[$name] HD 已有，跳過"; continue; fi
  echo "=== [$name] HD 階段1 (2560) $(date '+%H:%M:%S') ==="
  PYTHONPATH= "$UP" --image-path "$safe" --resolution 2x --output _tmp_hd1.jpg 2>&1 | tail -1
  echo "=== [$name] HD 階段2 (5120) $(date '+%H:%M:%S') ==="
  PYTHONPATH= "$UP" --image-path _tmp_hd1.jpg --resolution 2x --output "$hd" 2>&1 | tail -1
  rm -f _tmp_hd1.jpg
done
echo "=== HD ALL DONE $(date '+%H:%M:%S') ==="
ls -la *_safe_hd.webp | tail -20
