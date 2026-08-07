#!/bin/bash
# mflux 本地生成「活出精彩」三卡高品質圖（Z-Image-Turbo 8-bit）
OUT="/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/assets"
cd "$OUT"

gen() {
  echo ">>> $1 ($(date +%H:%M:%S))"
  PYTHONPATH= ~/.local/bin/mflux-generate-z-image-turbo \
    --prompt "$2" --width 1280 --height 800 --steps 9 -q 8 --seed "$3" \
    --output "$OUT/$1" 2>&1 | tail -2
  ls -la "$OUT/$1"
}

gen life_cycle.jpg "Photorealistic warm photograph, joyful Taiwanese couple in their 60s riding bicycles side by side on a scenic riverside bike path, lush green trees, golden afternoon sunlight streaming through leaves, genuine laughter, healthy vibrant retirement lifestyle, crisp detail, no text, no watermark" 555
gen life_family.jpg "Photorealistic warm photograph, multi-generational Taiwanese family (grandparents, parents, young adult) laughing together around a bright dining table with healthy fresh food, cozy modern bright home interior, soft warm window light, genuine joyful expressions, sense of hope and togetherness, crisp detail, no text, no watermark" 666
gen life_mountain.jpg "Photorealistic breathtaking photograph, Taiwanese senior couple standing on a mountain summit at sunrise raising arms in triumph, sea of clouds below, golden sun rays, inspiring vitality and freedom, crisp detail, cinematic composition, no text, no watermark" 777

echo "=== DONE ==="
