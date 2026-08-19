#!/bin/bash
# v2 English Hero — 30 張多元種族 → SeedVR2 放大至 5120x3200（1280→2560→5120）
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v2/assets

for i in $(seq -w 1 30); do
  src="hero_intl_${i}.jpg"
  hd="hero_intl_${i}_hd.jpg"
  if [ -f "$hd" ]; then
    echo ">>> intl_${i} 已有 HD，跳過"
    continue
  fi
  echo ">>> intl_${i} 階段1 (2560) $(date +%H:%M:%S)"
  PYTHONPATH= ~/.local/bin/mflux-upscale-seedvr2 --image-path "$src" --resolution 2x --output "_tmp_hd1.jpg" 2>&1 | tail -1
  echo ">>> intl_${i} 階段2 (5120) $(date +%H:%M:%S)"
  PYTHONPATH= ~/.local/bin/mflux-upscale-seedvr2 --image-path "_tmp_hd1.jpg" --resolution 2x --output "$hd" 2>&1 | tail -1
  rm -f _tmp_hd1.jpg
done
echo "=== ALL DONE ($(date +%H:%M:%S)) ==="
ls *_hd.jpg | wc -l
