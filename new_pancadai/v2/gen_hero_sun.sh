#!/bin/bash
# v2 Hero — 迎向陽光・擁抱生命 新圖（mflux 本地生成）
OUT="/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v2/assets"
cd "$OUT"
mkdir -p _gen

gen() {
  echo ">>> $1 ($(date +%H:%M:%S))"
  PYTHONPATH= ~/.local/bin/mflux-generate-z-image-turbo --prompt "$2" --width 1280 --height 800 --steps 9 -q 8 --seed "$3" --output "_gen/$1.jpg" 2>&1 | tail -2
}

gen hero_embrace "Photorealistic warm sunrise photograph, elderly Taiwanese man with arms wide open embracing the golden sunrise on a lush green hilltop, brilliant sun rays streaming toward him, glowing warm light, hopeful joyful mood, luminous sky with golden clouds, cinematic warm tones, copy space on left, no text, no watermark, 16:9 wide banner" 91
gen hero_couple "Photorealistic uplifting photograph, Taiwanese senior couple walking hand in hand on a sunlit coastal boardwalk at golden hour, warm sunlight flooding the scene, embracing life and nature, bright hopeful atmosphere, golden light, wide banner, no text, no watermark" 92
gen hero_grandpa "Photorealistic warm morning scene, Taiwanese grandfather lifting grandchild on shoulders in a sunlit park, golden sun rays through trees, laughing joyfully, embracing life, bright hopeful mood, warm color grading, wide banner, no text, no watermark" 93

echo "=== DONE ($(date +%H:%M:%S)) ==="
ls -la _gen/
