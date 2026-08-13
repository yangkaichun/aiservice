#!/bin/bash
# v2 活出精彩三卡 — 30 張候選圖（每主題 10 張，mflux 本地生成）
OUT="/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v2/assets"
cd "$OUT"
mkdir -p _gen
STYLE="Photorealistic warm photograph, high-key warm tone, hopeful joyful mood, genuine emotions, no text, no watermark"

gen() {
  echo ">>> $1 ($(date +%H:%M:%S))"
  PYTHONPATH= ~/.local/bin/mflux-generate-z-image-turbo --prompt "$2" --width 1024 --height 1024 --steps 9 -q 8 --seed "$3" --output "_gen/$1.jpg" 2>&1 | tail -1
}

# ===== 主題一：騎車追風的日子（退休長者 10 變化） =====
gen ride_01 "Happy Taiwanese retired man in his 60s riding a bicycle on a riverside bike path at golden sunrise, bright smile, $STYLE" 301
gen ride_02 "Happy Taiwanese retired couple riding bicycles side by side on a coastal road at sunrise, ocean view, $STYLE" 302
gen ride_03 "Happy Taiwanese retired man cycling on a small path between green rice paddies in morning light, $STYLE" 303
gen ride_04 "Happy Taiwanese retired man riding across a bridge at golden sunset, city skyline behind, $STYLE" 304
gen ride_05 "Happy Taiwanese retired woman cycling through a shaded park avenue in warm morning light, $STYLE" 305
gen ride_06 "Happy Taiwanese retired friends riding together on a country lane, laughing, warm morning, $STYLE" 306
gen ride_07 "Happy Taiwanese retired man on a bicycle tour with luggage rack, riding toward mountains at sunrise, $STYLE" 307
gen ride_08 "Happy Taiwanese retired man cycling on a misty riverside dike at dawn, golden light through mist, $STYLE" 308
gen ride_09 "Happy Taiwanese retired woman riding a bicycle through a blooming flower avenue, golden petals, $STYLE" 309
gen ride_10 "Happy Taiwanese retired man riding on a mountain road with green hills, morning sun rays, $STYLE" 310

# ===== 主題二：一家人的飯桌時光（三代同堂 10 變化） =====
gen table_01 "Three-generation Taiwanese family having dinner around a warm round table at home, grandparents parents children, laughing, warm cozy light, $STYLE" 311
gen table_02 "Taiwanese family celebrating a birthday around a cake at home, warm candle light, joyful, $STYLE" 312
gen table_03 "Taiwanese family enjoying a festive reunion dinner on New Year's Eve, abundant dishes, red decorations, warm, $STYLE" 313
gen table_04 "Taiwanese family having a relaxed weekend brunch at home, sunny kitchen, warm morning light, $STYLE" 314
gen table_05 "Taiwanese family gathering for a BBQ dinner in the garden at dusk, warm string lights, joyful, $STYLE" 315
gen table_06 "Taiwanese grandmother cooking in a cozy kitchen while family gathers around the dining table, warm light, $STYLE" 316
gen table_07 "Taiwanese family having a picnic meal on a blanket in a sunny park, grandparents and kids, $STYLE" 317
gen table_08 "Taiwanese family enjoying a hotpot dinner together at a round table, steam rising, cozy warm, $STYLE" 318
gen table_09 "Taiwanese couple having a candlelight dinner on a balcony at sunset, warm golden light, $STYLE" 319
gen table_10 "Taiwanese grandparents feeding noodle soup to their grandchild at a warm home table, touching, $STYLE" 320

# ===== 主題三：山頂的第一道曙光（登頂圓夢 10 變化） =====
gen peak_01 "Happy Taiwanese man in his 50s standing on a mountain summit waving at the golden sunrise, cloud sea below, $STYLE" 321
gen peak_02 "Happy Taiwanese senior hikers taking a group photo on a mountain peak at sunrise, arms raised, $STYLE" 322
gen peak_03 "Happy Taiwanese man in his 50s walking along a mountain ridge at first light, golden glow, $STYLE" 323
gen peak_04 "Happy Taiwanese man in his 50s on a mountain summit above a sea of clouds at sunrise, breathtaking, $STYLE" 324
gen peak_05 "Happy Taiwanese senior couple embracing on a mountain summit at sunrise, warm golden light, $STYLE" 325
gen peak_06 "Happy Taiwanese man in his 50s raising a hiking pole in triumph on a peak at sunrise, $STYLE" 326
gen peak_07 "Taiwanese mountain summit at sunrise with golden light on ridgeline, hiker silhouette celebrating, $STYLE" 327
gen peak_08 "Happy Taiwanese hikers holding a small Taiwan flag on a mountain summit at sunrise, proud, $STYLE" 328
gen peak_09 "Happy Taiwanese man in his 50s on a forest trail leading toward a sunlit mountain summit, god rays, $STYLE" 329
gen peak_10 "Happy Taiwanese senior couple having a small picnic on a mountain summit watching the sunrise, $STYLE" 330

echo "=== DONE ($(date +%H:%M:%S)) ==="
ls _gen/ | wc -l
