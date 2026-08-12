#!/bin/bash
# v8 素材批次生成 — 深藍戰情室「AI 哨兵」風格（mflux z-image-turbo，順序執行勿並行）
# 輸出：assets/v8gen/
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v8
mkdir -p assets/v8gen

GEN=~/.local/bin/mflux-generate-z-image-turbo
ARGS="--steps 9 --guidance 4.5"

run() {
  echo "=== [$1/$TOTAL] $2 ==="
  PYTHONPATH= $GEN --prompt "$3" --width $4 --height $5 --seed $6 --output "$7" 2>&1 | tail -2
  echo "=== done: $7 ==="
}

TOTAL=13

# --- Hero 主視覺 1600×900（zh/ja 共用 + en intl）---
run 1 "hero_main zh" "Photorealistic dark radiology reading room at night, deep navy blue color grading (#0a1628), Taiwanese radiologist in white coat standing with back to camera, viewing large glowing CT scan monitors showing abdominal CT slices, subtle cyan-blue scan line sweeping across the screens, medical AI surveillance command center atmosphere, cinematic moody lighting, soft blue glow, copy space on left side, no text, no watermark" 1600 900 2001 assets/v8gen/hero_main.jpg
run 2 "hero_intl en" "Photorealistic dark radiology command center at night, deep navy blue color grading, diverse international medical team (Caucasian and Asian doctors) viewing large glowing CT monitors, subtle blue scan lines, high-tech medical AI atmosphere, cinematic moody, soft blue rim light, copy space on left, no text, no watermark" 1600 900 2002 assets/v8gen/hero_intl.jpg

# --- 背景池 zh/ja 1280×800 ---
run 3 "bg_ct_room" "Photorealistic modern CT scanner machine in dark hospital radiology suite at night, deep navy blue ambient lighting, glowing blue control panels, high-tech medical equipment, cinematic, no people, no text, no watermark" 1280 800 2003 assets/v8gen/bg_ct_room.jpg
run 4 "bg_reading" "Photorealistic dark radiology reading room with multiple glowing medical monitors, deep navy blue atmosphere, blue scan lines on screens, empty room, cinematic moody, no text, no watermark" 1280 800 2004 assets/v8gen/bg_reading.jpg
run 5 "bg_hospital" "Photorealistic empty hospital corridor at night, deep navy blue moody lighting, glass walls, soft blue glow, cinematic perspective, no people, no text, no watermark" 1280 800 2005 assets/v8gen/bg_hospital.jpg
run 6 "bg_data" "Photorealistic medical data center server room, deep navy blue lighting, glowing blue server racks, AI computing atmosphere, cinematic, no text, no watermark" 1280 800 2006 assets/v8gen/bg_data.jpg
run 7 "bg_patient" "Photorealistic elderly Taiwanese patient with family member in warm hospital room at night, deep navy blue ambience with warm lamp glow contrast, hopeful mood, cinematic, no text, no watermark" 1280 800 2007 assets/v8gen/bg_patient.jpg
run 8 "bg_doctor" "Photorealistic close-up of Taiwanese doctor examining CT scans on monitor in dark room, deep navy blue lighting, blue screen glow on face, focused expression, cinematic, no text, no watermark" 1280 800 2008 assets/v8gen/bg_doctor.jpg

# --- 背景池 en intl 1280×800 ---
run 9 "bg_intl_ct" "Photorealistic modern CT scanner in dark hospital suite at night, deep navy blue lighting, diverse international medical staff in background, glowing control panels, cinematic, no text, no watermark" 1280 800 2009 assets/v8gen/bg_intl_ct.jpg
run 10 "bg_intl_reading" "Photorealistic dark radiology reading room, multinational team of doctors (Caucasian, Black, Asian) viewing glowing CT monitors, deep navy blue atmosphere, blue scan lines, cinematic, no text, no watermark" 1280 800 2010 assets/v8gen/bg_intl_reading.jpg
run 11 "bg_intl_hospital" "Photorealistic modern hospital corridor at night with diverse international staff walking, deep navy blue moody lighting, glass architecture, soft blue glow, cinematic, no text, no watermark" 1280 800 2011 assets/v8gen/bg_intl_hospital.jpg
run 12 "bg_intl_data" "Photorealistic high-tech AI data center, deep navy blue lighting, glowing server racks with blue LEDs, diverse technicians, cinematic, no text, no watermark" 1280 800 2012 assets/v8gen/bg_intl_data.jpg
run 13 "bg_intl_patient" "Photorealistic elderly patient with diverse international family in hospital room at night, deep navy blue ambience with warm lamp glow, hopeful, cinematic, no text, no watermark" 1280 800 2013 assets/v8gen/bg_intl_patient.jpg

echo "=== ALL DONE ==="
ls -la assets/v8gen/
