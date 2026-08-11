#!/bin/bash
# v2 背景 safe 版 → SeedVR2 放大至 5120x2880（1280x720→2560x1440→5120x2880）
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v2/assets

# 台灣 7 張 + 英文 30 張
NAMES="hero_sun_bike hero_sun_yoga hero_sun_picnic hero_sun_coffee hero_sun_kayak hero_sun_bridge hero_sun_forest $(for i in $(seq -w 1 30); do echo hero_intl_$i; done)"

for n in $NAMES; do
  hd="${n}_safe_hd.jpg"
  if [ -f "$hd" ]; then
    echo ">>> ${n} 已有 HD，跳過"
    continue
  fi
  echo ">>> ${n} 階段1 (2560) $(date +%H:%M:%S)"
  PYTHONPATH= ~/.local/bin/mflux-upscale-seedvr2 --image-path "${n}_safe.jpg" --resolution 2x --output "_tmp_hd1.jpg" 2>&1 | tail -1
  echo ">>> ${n} 階段2 (5120) $(date +%H:%M:%S)"
  PYTHONPATH= ~/.local/bin/mflux-upscale-seedvr2 --image-path "_tmp_hd1.jpg" --resolution 2x --output "$hd" 2>&1 | tail -1
  rm -f _tmp_hd1.jpg
done
echo "=== ALL DONE ($(date +%H:%M:%S)) ==="
ls *_safe_hd.jpg 2>/dev/null | wc -l
