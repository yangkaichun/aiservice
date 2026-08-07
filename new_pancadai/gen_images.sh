#!/bin/bash
# 產出 pancad.ai 新網站 B 方向系列圖（Pollinations 免費 API）
# hero: 1600x900 (16:9)  情境: 1400x933 (3:2)
OUT="/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/assets"
mkdir -p "$OUT"

gen() { # $1=檔名 $2=prompt $3=寬x高 $4=seed
  curl -sL --max-time 90 "https://image.pollinations.ai/prompt/$2?width=$3&height=$4&nologo=true&seed=$5" -o "$OUT/$1"
  local sz=$(stat -f%z "$OUT/$1" 2>/dev/null || echo 0)
  echo "[$1] $sz bytes"
}

# --- Hero 變體（B 方向: 活力慢跑） ---
gen hero_v1.jpg "Photorealistic%20warm%20photograph%2C%20energetic%20Taiwanese%20man%20in%20his%2060s%20jogging%20on%20a%20coastal%20boardwalk%20at%20sunrise%2C%20ocean%20and%20soft%20pastel%20sky%2C%20healthy%20active%20lifestyle%2C%20genuine%20joyful%20smile%2C%20warm%20bright%20tones%2C%20clean%20composition%20with%20open%20sky%20copy%20space%2C%20no%20text%2C%20no%20watermark%2C%20cinematic%20wide%20banner" 1600 900 21
gen hero_v2.jpg "Photorealistic%20warm%20photograph%2C%20happy%20Taiwanese%20woman%20in%20her%2050s%20stretching%20with%20a%20smile%20in%20a%20sunny%20city%20park%20at%20morning%2C%20green%20trees%20soft%20bokeh%2C%20healthy%20vital%2C%20sportswear%2C%20golden%20sunlight%2C%20clean%20composition%20copy%20space%20left%2C%20no%20text%2C%20no%20watermark%2C%20wide%20banner" 1600 900 42

# --- 生活情境（活出精彩區） ---
gen life_cycle.jpg "Photorealistic%20warm%20photograph%2C%20Taiwanese%20couple%20in%20their%2060s%20riding%20bicycles%20together%20on%20a%20scenic%20riverside%20bike%20path%2C%20green%20landscape%2C%20laughing%2C%20healthy%20joyful%20retirement%20lifestyle%2C%20warm%20afternoon%20light%2C%20no%20text%2C%20no%20watermark" 1400 933 55
gen life_family.jpg "Photorealistic%20warm%20photograph%2C%20multi-generational%20Taiwanese%20family%20laughing%20together%20around%20a%20bright%20dining%20table%20with%20healthy%20food%2C%20cozy%20modern%20home%2C%20warm%20window%20light%2C%20joyful%20expressions%2C%20hope%2C%20no%20text%2C%20no%20watermark" 1400 933 66
gen life_mountain.jpg "Photorealistic%20breathtaking%20photograph%2C%20Taiwanese%20senior%20hikers%20reaching%20a%20mountain%20summit%20at%20sunrise%2C%20sea%20of%20clouds%20below%2C%20raising%20arms%20in%20triumph%2C%20golden%20light%2C%20inspiring%20vitality%2C%20no%20text%2C%20no%20watermark" 1400 933 77

echo "=== DONE ==="
ls -la "$OUT"
