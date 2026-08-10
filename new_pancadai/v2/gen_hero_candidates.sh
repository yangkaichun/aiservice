#!/bin/bash
# v2 Hero — 12 張候選圖：迎向陽光・溫馨・希望活力（多樣構圖與人物）
OUT="/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v2/assets"
cd "$OUT"
mkdir -p _gen

BASE="Photorealistic warm sunrise scene, happy Taiwanese person in early 40s"
TAIL=", golden sun rays, high-key warm tone, hopeful energetic mood, copy space on left side, no text, no watermark, 16:9 wide banner"

gen() {
  echo ">>> $1 ($(date +%H:%M:%S))"
  PYTHONPATH= ~/.local/bin/mflux-generate-z-image-turbo --prompt "$2" --width 1280 --height 800 --steps 9 -q 8 --seed "$3" --output "_gen/$1.jpg" 2>&1 | tail -1
}

gen hero_sun_bike "Photorealistic warm sunrise scene, happy Taiwanese man in his early 40s riding a road bicycle on a riverside bike path toward the golden sunrise, genuine bright smile, healthy energetic${TAIL}" 201
gen hero_sun_yoga "Photorealistic warm sunrise scene, happy Taiwanese woman in her early 40s doing a joyful yoga stretch on a beach at sunrise, arms open wide, hair flowing, sun rays over the ocean${TAIL}" 202
gen hero_sun_picnic "Photorealistic warm morning scene, Taiwanese couple in their early 40s with a young child having a happy picnic on a sunny green park lawn, laughing together, golden morning light through trees${TAIL}" 203
gen hero_sun_jog "Photorealistic warm sunrise scene, happy Taiwanese man in his early 40s jogging on a river dike path toward the rising sun, energetic stride, golden sky reflections on water${TAIL}" 204
gen hero_sun_coffee "Photorealistic warm morning scene, happy Taiwanese woman in her early 40s holding a coffee cup on a sunny balcony, gentle smile, golden sunrise light over the city${TAIL}" 205
gen hero_sun_kayak "Photorealistic warm sunrise scene, happy Taiwanese man in his early 40s paddling a kayak on a calm lake toward the golden sunrise, sun glittering on water, joyful${TAIL}" 206
gen hero_sun_flowers "Photorealistic warm sunrise scene, happy Taiwanese woman in her early 40s walking joyfully through a blooming flower field, arms gently open, golden morning light, butterflies${TAIL}" 207
gen hero_sun_hug "Photorealistic warm sunrise scene, Taiwanese couple in their early 40s embracing and smiling on a rooftop balcony facing the golden sunrise, cozy warm hug, city skyline behind${TAIL}" 208
gen hero_sun_summit "Photorealistic warm sunrise scene, happy Taiwanese man in his early 40s standing on a mountain summit raising one arm in triumph, golden clouds sea below, breathtaking sunrise${TAIL}" 209
gen hero_sun_bridge "Photorealistic warm sunrise scene, happy Taiwanese woman in her early 40s walking across a city bridge toward the golden sunrise, gentle wind, glowing skyline${TAIL}" 210
gen hero_sun_forest "Photorealistic warm morning scene, happy Taiwanese man in his early 40s walking on a sunlit forest trail, golden god rays through tall trees, peaceful joyful${TAIL}" 211
gen hero_sun_garden "Photorealistic warm morning scene, happy Taiwanese woman in her early 40s watering flowers in a sunlit garden, gentle smile, golden light, dewdrops sparkling${TAIL}" 212

echo "=== DONE ($(date +%H:%M:%S)) ==="
ls _gen/ | wc -l
