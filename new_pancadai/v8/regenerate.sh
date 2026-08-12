#!/bin/bash
# v8 素材重製：hero_main → 腹部 CT 主視覺；bg_reading → 戰情室
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v8/assets/v8gen

GEN=~/.local/bin/mflux-generate-z-image-turbo

echo "=== [1/2] hero_main 腹部 CT 主視覺 ==="
PYTHONPATH= $GEN --prompt "Photorealistic large abdominal CT scan image as the hero visual, dark radiology command center background deep navy blue (#0a1628), a bright CT slice of the pancreas area displayed full-frame on a glowing medical monitor, subtle cyan-blue scan line sweeping across the image, a small orange AI detection reticle frame highlighting a tiny lesion on the pancreas, cinematic moody high-tech medical AI atmosphere, dramatic blue glow, copy space on left side for text, no text, no watermark" --width 1600 --height 900 --seed 3001 --output hero_main.jpg 2>&1 | tail -2

echo "=== [2/2] bg_reading 改戰情室 ==="
PYTHONPATH= $GEN --prompt "Photorealistic futuristic medical AI command center war room at night, wall of large glowing monitors showing abdominal CT scans and medical data dashboards, deep navy blue ambient lighting, a central large screen with CT images, subtle blue scan lines, high-tech surveillance control room atmosphere, cinematic moody, no people, no text, no watermark" --width 1280 --height 800 --seed 3002 --output bg_reading.jpg 2>&1 | tail -2

echo "=== DONE ==="
ls -la hero_main.jpg bg_reading.jpg
