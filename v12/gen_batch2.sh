#!/bin/bash
# v11.2.20 第二批：重生成無 pad 滿版圖（bike..yoga 7 張 + C2 + intl 30 張）
# 2560×1440 產線（穩定）→ 完成後 process_nopad_batch2.sh 轉無 pad 版
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11
mkdir -p _gen_v11
MFX="$HOME/.local/bin/mflux-generate-z-image-turbo"

# 格式：name|prompt
declare -a JOBS=(
"hero_sun_bike|A Taiwanese man riding a bicycle along a riverside bike path in Taipei at golden morning light, river and city skyline in background, bright cheerful everyday scenery, photorealistic, wide 16:9 composition, space at top"
"hero_sun_bridge|A scenic bridge in Taiwan crossing a river at sunrise, warm golden light, mountains in distance, calm water reflections, photorealistic landscape, wide 16:9 composition"
"hero_sun_coffee|A cozy coffee shop in Taipei with warm morning sunlight through large windows, a Taiwanese woman reading a book with a coffee cup on the wooden table, relaxed atmosphere, photorealistic, wide 16:9 composition"
"hero_sun_forest|A lush green forest trail in Taiwan with sunlight filtering through tall trees, morning mist, peaceful nature scenery, photorealistic, wide 16:9 composition"
"hero_sun_kayak|A person kayaking on a calm turquoise lake surrounded by green mountains in Taiwan, bright sunny day, peaceful water activity, photorealistic, wide 16:9 composition"
"hero_sun_picnic|A family picnic on green grass in a Taiwan park under a big tree, picnic basket and food on a blanket, warm afternoon sunlight, cheerful everyday scene, photorealistic, wide 16:9 composition"
"hero_sun_yoga|A woman doing yoga pose on a wooden deck overlooking green mountains in Taiwan at sunrise, peaceful wellness scene, warm morning light, photorealistic, wide 16:9 composition"
"hero_v7_morning_intl|A diverse group of European people starting a bright morning together in a sunlit park, walking and smiling, warm golden sunrise light, Western European setting, photorealistic, wide 16:9 composition, heads fully visible with space at top"
"hero_intl_01|Western European elderly couple walking in a sunny park in the morning, warm light, photorealistic, wide 16:9 composition"
"hero_intl_02|Young European woman cycling through a cobblestone old town street in morning sun, photorealistic, wide 16:9 composition"
"hero_intl_03|European family having breakfast at a bright cafe terrace, morning sunlight, photorealistic, wide 16:9 composition"
"hero_intl_04|European man jogging along a river embankment at sunrise, photorealistic, wide 16:9 composition"
"hero_intl_05|Two European friends walking through a flower market in morning light, photorealistic, wide 16:9 composition"
"hero_intl_06|European woman reading a newspaper at a sunny park bench, pigeons around, photorealistic, wide 16:9 composition"
"hero_intl_07|European grandfather with granddaughter flying a kite in a green park, morning sun, photorealistic, wide 16:9 composition"
"hero_intl_08|European man drinking espresso at a sidewalk cafe in the morning, photorealistic, wide 16:9 composition"
"hero_intl_09|European woman running in a city park at sunrise, photorealistic, wide 16:9 composition"
"hero_intl_10|European couple riding bicycles through countryside lanes in morning light, photorealistic, wide 16:9 composition"
"hero_intl_11|European man fishing by a calm lake at sunrise, photorealistic, wide 16:9 composition"
"hero_intl_12|European woman doing morning yoga on a balcony overlooking a city, sunrise, photorealistic, wide 16:9 composition"
"hero_intl_13|European family walking to school together in morning sun, photorealistic, wide 16:9 composition"
"hero_intl_14|European man reading a book in a sunny library garden, morning light, photorealistic, wide 16:9 composition"
"hero_intl_15|European woman shopping at an open-air morning market, fresh produce, photorealistic, wide 16:9 composition"
"hero_intl_16|European couple having coffee at home by a bright window, morning sun, photorealistic, wide 16:9 composition"
"hero_intl_17|European man gardening in a sunny backyard in the morning, photorealistic, wide 16:9 composition"
"hero_intl_18|European woman walking her dog along a canal at sunrise, photorealistic, wide 16:9 composition"
"hero_intl_19|European friends having a picnic in a meadow with mountains behind, morning light, photorealistic, wide 16:9 composition"
"hero_intl_20|European man commuting by tram in a sunny city morning, photorealistic, wide 16:9 composition"
"hero_intl_21|European woman painting outdoors in a park at sunrise, easel and canvas, photorealistic, wide 16:9 composition"
"hero_intl_22|European family having brunch at a bright restaurant, morning sun through windows, photorealistic, wide 16:9 composition"
"hero_intl_23|European man walking through a lavender field at sunrise, photorealistic, wide 16:9 composition"
"hero_intl_24|European woman swimming laps in an outdoor pool, morning light, photorealistic, wide 16:9 composition"
"hero_intl_25|European couple browsing a bookshop on a sunny morning, photorealistic, wide 16:9 composition"
"hero_intl_26|European man having a croissant and coffee at a bakery terrace, morning sun, photorealistic, wide 16:9 composition"
"hero_intl_27|European woman walking across a historic bridge in morning light, photorealistic, wide 16:9 composition"
"hero_intl_28|European children playing football in a park, morning sun, photorealistic, wide 16:9 composition"
"hero_intl_29|European man doing tai chi by a lake at sunrise, photorealistic, wide 16:9 composition"
"hero_intl_30|European woman enjoying a book on a sunny rooftop terrace, city view, morning light, photorealistic, wide 16:9 composition"
)

for job in "${JOBS[@]}"; do
  name="${job%%|*}"; prompt="${job#*|}"
  raw="_gen_v11/${name}_raw.jpg"
  [ -f "$raw" ] && { echo "✅ [$name] 已有 raw"; continue; }
  attempt=0
  while [ $attempt -lt 3 ]; do
    attempt=$((attempt+1))
    echo "=== [$name] 嘗試 $attempt/3 $(date '+%H:%M:%S') ==="
    PYTHONPATH= "$MFX" --output "$raw" --width 2560 --height 1440 --steps 4 --seed $RANDOM --prompt "$prompt" > "_gen_v11/${name}.log" 2>&1 &
    MPID=$!
    while kill -0 $MPID 2>/dev/null; do
      sleep 30
      [ -f "$raw" ] && break
      mt=$(stat -f %m "_gen_v11/${name}.log" 2>/dev/null || echo 0)
      now=$(date +%s); age=$((now - mt))
      if [ $age -gt 240 ]; then
        echo "  ⚠️ [$name] 卡住（log ${age}s）→ kill 重試"
        kill $MPID 2>/dev/null; pkill -P $MPID 2>/dev/null; sleep 2
        rm -f "$raw"
        break
      fi
    done
    [ -f "$raw" ] && { echo "  ✓ [$name] 完成"; break; }
  done
  [ -f "$raw" ] || echo "  ❌ [$name] 失敗"
done
echo "=== BATCH2 GEN DONE $(date '+%H:%M:%S') ==="
ls _gen_v11/hero_sun_bike_raw.jpg _gen_v11/hero_v7_morning_intl_raw.jpg _gen_v11/hero_intl_01_raw.jpg 2>/dev/null | wc -l
