#!/bin/bash
# v11.2.16: 補 v7 hero 圖 HD（couple/intl → 5120×2880）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11/assets
UP="$HOME/.local/bin/mflux-upscale-seedvr2"
for name in hero_v7_morning_couple hero_v7_morning_intl; do
  safe="${name}_safe.jpg"
  hd="${name}_safe_hd.webp"
  [ -f "$hd" ] && { echo "[$name] HD 已有"; continue; }
  echo "=== [$name] HD 階段1 (2560) $(date '+%H:%M:%S') ==="
  PYTHONPATH= "$UP" --image-path "$safe" --resolution 2x --output _tmp_v7_1.jpg 2>&1 | tail -1
  echo "=== [$name] HD 階段2 (5120) $(date '+%H:%M:%S') ==="
  PYTHONPATH= "$UP" --image-path _tmp_v7_1.jpg --resolution 2x --output "$hd" 2>&1 | tail -1
  rm -f _tmp_v7_1.jpg
done
echo "=== V7 HD ALL DONE $(date '+%H:%M:%S') ==="
ls -la hero_v7_morning_*_safe_hd.webp
