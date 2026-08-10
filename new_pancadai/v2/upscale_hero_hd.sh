#!/bin/bash
# v2 隨機背景 6 張 → SeedVR2 放大到 5120x3200（1280→2560→5120 兩階段）
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v2/assets

for name in bike yoga coffee kayak bridge forest; do
  src="hero_sun_${name}.jpg"
  if [ -f "hero_sun_${name}_hd.jpg" ]; then
    echo ">>> $name 已有 HD，跳過"
    continue
  fi
  echo ">>> $name 階段1 (2560) $(date +%H:%M:%S)"
  PYTHONPATH= ~/.local/bin/mflux-upscale-seedvr2 --image-path "$src" --resolution 2x --output "_tmp_hd1.jpg" 2>&1 | tail -1
  echo ">>> $name 階段2 (5120) $(date +%H:%M:%S)"
  PYTHONPATH= ~/.local/bin/mflux-upscale-seedvr2 --image-path "_tmp_hd1.jpg" --resolution 2x --output "hero_sun_${name}_hd.jpg" 2>&1 | tail -1
  rm -f _tmp_hd1.jpg
  ls -la "hero_sun_${name}_hd.jpg"
done
echo "=== ALL DONE ($(date +%H:%M:%S)) ==="
