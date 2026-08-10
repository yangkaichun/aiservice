#!/bin/bash
# v2 English Hero — 30 張多元種族・西歐語系候選圖（mflux 本地生成）
OUT="/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v2/assets"
cd "$OUT"
mkdir -p _gen
STYLE="Photorealistic warm sunrise scene, high-key warm tone, golden sun rays, hopeful joyful energetic mood, genuine bright smile, copy space on left side, no text, no watermark, 16:9 wide banner"

gen() {
  echo ">>> $1 ($(date +%H:%M:%S))"
  PYTHONPATH= ~/.local/bin/mflux-generate-z-image-turbo --prompt "$2" --width 1280 --height 800 --steps 9 -q 8 --seed "$3" --output "_gen/$1.jpg" 2>&1 | tail -1
}

# ===== 白人 / 西歐族群（5 張） =====
gen hero_intl_01 "Happy Caucasian man in his early 40s with arms wide open embracing the golden sunrise on a green European hilltop, Scandinavian countryside, ${STYLE}" 401
gen hero_intl_02 "Happy blonde Caucasian woman in her 40s doing joyful yoga on a Mediterranean beach at sunrise, ${STYLE}" 402
gen hero_intl_03 "Happy Caucasian family with two children having a picnic on a sunny English countryside lawn at golden morning, ${STYLE}" 403
gen hero_intl_04 "Happy Caucasian woman holding a coffee cup on a Parisian balcony at sunrise, city rooftops, ${STYLE}" 404
gen hero_intl_05 "Happy Caucasian couple embracing on an Alpine mountain summit at golden sunrise, ${STYLE}" 405

# ===== 黑人族群（5 張） =====
gen hero_intl_06 "Happy Black man in his early 40s cycling on a riverside bike path toward the golden sunrise, ${STYLE}" 406
gen hero_intl_07 "Happy Black woman walking joyfully through a blooming sunflower field at sunrise, ${STYLE}" 407
gen hero_intl_08 "Happy Black family having a picnic on a sunny park lawn, parents and kids laughing, golden morning light, ${STYLE}" 408
gen hero_intl_09 "Happy Black man jogging across a city bridge at sunrise, skyline glowing, ${STYLE}" 409
gen hero_intl_10 "Happy Black woman doing sunrise yoga on a calm lakeside deck, golden reflections, ${STYLE}" 410

# ===== 拉丁裔族群（5 張） =====
gen hero_intl_11 "Happy Latina woman running joyfully with arms open on a golden sand beach at sunrise, ${STYLE}" 411
gen hero_intl_12 "Happy Latino man riding a road bicycle along a coastal highway at sunrise, ocean view, ${STYLE}" 412
gen hero_intl_13 "Happy Latino family having breakfast on a sunny Mediterranean terrace at golden morning, ${STYLE}" 413
gen hero_intl_14 "Happy Latino man standing on a mountain summit raising his arms at sunrise, cloud sea, ${STYLE}" 414
gen hero_intl_15 "Happy Latina woman watering flowers in a sunlit Andalusian garden at dawn, ${STYLE}" 415

# ===== 中東族群（5 張） =====
gen hero_intl_16 "Happy Middle Eastern man jogging in a sunlit city park at golden sunrise, ${STYLE}" 416
gen hero_intl_17 "Happy Middle Eastern woman with a light scarf drinking coffee in a sunlit garden at dawn, ${STYLE}" 417
gen hero_intl_18 "Happy Middle Eastern family having breakfast on a rooftop terrace at sunrise, city view, ${STYLE}" 418
gen hero_intl_19 "Happy Middle Eastern man practicing sunrise yoga on a serene beach, golden light, ${STYLE}" 419
gen hero_intl_20 "Happy Middle Eastern woman walking joyfully on a hillside path at golden sunrise, ${STYLE}" 420

# ===== 南亞裔 / 印度族群（5 張） =====
gen hero_intl_21 "Happy Indian man doing sunrise yoga by a calm river at golden morning, ${STYLE}" 421
gen hero_intl_22 "Happy Indian woman walking joyfully through a colorful flower field at sunrise, ${STYLE}" 422
gen hero_intl_23 "Happy Indian family having a picnic on a sunny green lawn, grandparents and children, golden light, ${STYLE}" 423
gen hero_intl_24 "Happy Indian man standing on a mountain summit at golden sunrise, Himalayan view, ${STYLE}" 424
gen hero_intl_25 "Happy Indian woman jogging across a river bridge at sunrise, ${STYLE}" 425

# ===== 多元種族組合（5 張） =====
gen hero_intl_26 "Diverse group of happy friends of different ethnicities running on a beach toward the golden sunrise, ${STYLE}" 426
gen hero_intl_27 "Diverse group of happy friends cycling together on a country lane at sunrise, different ethnicities, ${STYLE}" 427
gen hero_intl_28 "Diverse multi-family picnic with people of different ethnicities on a sunny park lawn at golden morning, ${STYLE}" 428
gen hero_intl_29 "Diverse group of runners of different ethnicities on a city riverside path at sunrise, ${STYLE}" 429
gen hero_intl_30 "Diverse group of friends of different ethnicities on a mountain summit cheering at sunrise, ${STYLE}" 430

echo "=== DONE ($(date +%H:%M:%S)) ==="
ls _gen/ | wc -l
