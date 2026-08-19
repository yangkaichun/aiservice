#!/bin/bash
# v8 素材 HD 放大（SeedVR2，正確參數版）— 順序執行勿並行
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v8/assets/v8gen

UP=~/.local/bin/mflux-upscale-seedvr2

echo "=== hero_main HD ==="
PYTHONPATH= $UP --image-path hero_main_safe.jpg --resolution 2x --output hero_main_hd.jpg 2>&1 | tail -2
echo "=== hero_intl HD ==="
PYTHONPATH= $UP --image-path hero_intl_safe.jpg --resolution 2x --output hero_intl_hd.jpg 2>&1 | tail -2

echo "=== DONE ==="
ls -la hero_*hd*.jpg 2>/dev/null || true
