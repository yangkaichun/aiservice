#!/bin/bash
# v7 hero 晨光圖生成（zh 台灣夫妻 / en 多元種族）— 輸出直接到 assets/
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v7

PYTHONPATH= ~/.local/bin/mflux-generate-z-image-turbo \
  --model z-image-turbo --width 1600 --height 900 --steps 9 --guidance 4.5 --seed 7011 \
  --prompt "Photorealistic warm sunrise photograph, happy Taiwanese couple in their early 40s walking hand in hand toward the golden sunrise on a green hilltop, genuine bright smiles, healthy energetic hopeful mood, high-key warm golden morning light, sun rays, soft morning haze, wildflowers, copy space on left side, no text, no watermark, 16:9 wide banner" \
  --output assets/hero_v7_morning_couple.jpg && \
echo "COUPLE DONE $(date +%H:%M:%S)"

PYTHONPATH= ~/.local/bin/mflux-generate-z-image-turbo \
  --model z-image-turbo --width 1600 --height 900 --steps 9 --guidance 4.5 --seed 7012 \
  --prompt "Photorealistic warm sunrise photograph, diverse group of happy friends in their early 40s (East Asian woman, Caucasian man, Black woman, South Asian man) jogging together on a coastal boardwalk toward the golden sunrise, genuine bright smiles, healthy energetic hopeful mood, high-key warm golden morning light, sun rays sparkling on the sea, no text, no watermark, 16:9 wide banner" \
  --output assets/hero_v7_morning_intl.jpg && \
echo "INTL DONE $(date +%H:%M:%S)"
