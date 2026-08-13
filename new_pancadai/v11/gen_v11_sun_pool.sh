#!/bin/bash
# v11.2: 生成 10 張高解析擬真圖（zh/ja 池新增），依序執行勿並行
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11/assets
GEN="$HOME/.local/bin/mflux-generate-z-image-turbo"
COMMON="--model z-image-turbo --width 1600 --height 900 --steps 9 --guidance 4.5"

declare -a PROMPTS=(
  "Photorealistic warm photograph, three-generation Taiwanese family (grandparents, parents, young child) walking in a sunlit park at golden morning, genuine bright smiles, healthy energetic, soft natural light, clean composition with copy space, no text, no watermark, 16:9 wide banner"
  "Photorealistic warm photograph, Taiwanese couple in their 40s having morning coffee on a sunny balcony, city skyline in warm morning light, relaxed happy mood, cozy home atmosphere, no text, no watermark, 16:9 wide"
  "Photorealistic warm photograph, Taiwanese man and woman in their 40s cycling on a riverside bike path at sunrise, golden light, active healthy lifestyle, genuine smiles, motion energy, no text, no watermark, 16:9 wide"
  "Photorealistic warm photograph, Taiwanese elderly couple practicing tai chi in a green park at morning, soft golden sunlight through trees, peaceful healthy lifestyle, no text, no watermark, 16:9 wide"
  "Photorealistic warm photograph, Taiwanese family of three walking barefoot on a beach at sunrise, gentle waves, golden light, joyful genuine laughter, clean composition with copy space, no text, no watermark, 16:9 wide"
  "Photorealistic warm photograph, friendly Taiwanese doctor in white coat talking with a middle-aged patient at a modern health checkup center, bright clean interior, warm reassuring smiles, medical AI screen in soft-focus background, no text, no watermark, 16:9 wide"
  "Photorealistic warm photograph, Taiwanese couple in their 50s hiking a mountain trail at dawn, misty green ridges, warm sunrise light, energetic healthy retirement lifestyle, genuine smiles, no text, no watermark, 16:9 wide"
  "Photorealistic warm photograph, Taiwanese woman in her 50s selecting fresh colorful vegetables and fruits at a bright market stall, healthy nutrition theme, warm natural light, genuine smile, no text, no watermark, 16:9 wide"
  "Photorealistic warm photograph, Taiwanese family having a picnic on green grass in a park, bamboo picnic basket, sunlight through leaves, children laughing, warm happy atmosphere, no text, no watermark, 16:9 wide"
  "Photorealistic warm photograph, Taiwanese woman in her 40s doing morning yoga in a bright living room with floor-to-ceiling windows, golden sunrise light streaming in, peaceful healthy lifestyle, no text, no watermark, 16:9 wide"
)

mkdir -p _gen_v11
for i in "${!PROMPTS[@]}"; do
  n=$((i + 1))
  out="_gen_v11/hero_sun_${n}_raw.jpg"
  if [ -f "$out" ] && [ -s "$out" ]; then
    echo "[$n/10] skip existing $out"
    continue
  fi
  echo "[$n/10] generating... ($(date '+%H:%M:%S'))"
  PYTHONPATH= "$GEN" $COMMON --seed $((1000 + i * 37)) --prompt "${PROMPTS[$i]}" --output "$out"
  echo "[$n/10] done $(date '+%H:%M:%S')"
done
echo "ALL 10 DONE"
ls -la _gen_v11/
