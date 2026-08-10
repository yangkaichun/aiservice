#!/bin/bash
# v2 Hero — 40 歲主角 迎向陽光・充滿希望活力（mflux 本地生成）
OUT="/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v2/assets"
cd "$OUT"
mkdir -p _gen

gen() {
  echo ">>> $1 ($(date +%H:%M:%S))"
  PYTHONPATH= ~/.local/bin/mflux-generate-z-image-turbo --prompt "$2" --width 1280 --height 800 --steps 9 -q 8 --seed "$3" --output "_gen/$1.jpg" 2>&1 | tail -2
}

gen hero_man40 "Photorealistic warm sunrise photograph, happy Taiwanese man in his early 40s with arms wide open embracing the golden sunrise on a lush green hilltop, brilliant sun rays streaming toward him, genuine bright smile, healthy energetic hopeful mood, high-key warm tone, luminous golden sky, copy space on left side, no text, no watermark, 16:9 wide banner" 101
gen hero_woman40 "Photorealistic uplifting photograph, happy Taiwanese woman in her early 40s running joyfully with arms open toward the golden sunrise on a green meadow, sun rays flooding the scene, hair flowing in light breeze, bright smile, healthy energetic hopeful mood, high-key warm tones, copy space on left, no text, no watermark, 16:9 wide banner" 102
gen hero_couple40 "Photorealistic warm photograph, Taiwanese couple in their early 40s walking hand in hand smiling toward a radiant golden sunrise on a hilltop, embracing life, sun rays and golden glow, healthy energetic hopeful mood, high-key warm tones, copy space on left, no text, no watermark, 16:9 wide banner" 103

echo "=== DONE ($(date +%H:%M:%S)) ==="
ls -la _gen/
