#!/bin/bash
# v11.2.16: 輪播大圖 HD（ai_reading/life_cycle/act04/clinician_hero → 5120 webp）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11/assets
UP="$HOME/.local/bin/mflux-upscale-seedvr2"
declare -a NAMES=(ai_reading life_cycle act04_pancreas clinician_hero)
for name in "${NAMES[@]}"; do
  hd="${name}_hd.webp"
  [ -f "$hd" ] && { echo "[$name] HD 已有"; continue; }
  echo "=== [$name] HD 階段1 (2560) $(date '+%H:%M:%S') ==="
  PYTHONPATH= "$UP" --image-path "${name}.jpg" --resolution 2x --output _tmp_car_1.jpg 2>&1 | tail -1
  echo "=== [$name] HD 階段2 (5120) $(date '+%H:%M:%S') ==="
  PYTHONPATH= "$UP" --image-path _tmp_car_1.jpg --resolution 2x --output "$hd" 2>&1 | tail -1
  rm -f _tmp_car_1.jpg
done
echo "=== CAROUSEL HD ALL DONE $(date '+%H:%M:%S') ==="
ls -la ai_reading_hd.webp life_cycle_hd.webp act04_pancreas_hd.webp clinician_hero_hd.webp 2>/dev/null
