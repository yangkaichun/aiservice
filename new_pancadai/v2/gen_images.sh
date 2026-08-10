#!/bin/bash
# v2 官網 — mflux 本地生成暖色調 AI 醫療圖
OUT="/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v2/assets"
cd "$OUT"
mkdir -p _gen

gen() {
  echo ">>> $1 ($(date +%H:%M:%S))"
  PYTHONPATH= ~/.local/bin/mflux-generate-z-image-turbo --prompt "$2" --width 1280 --height 800 --steps 9 -q 8 --seed "$3" --output "_gen/$1.jpg" 2>&1 | tail -2
}

gen hero_medtech "Photorealistic warm bright photograph, modern AI medical technology scene, large soft golden sunlight streaming through hospital window, elegant medical workstation with glowing AI scan display showing pancreas CT with highlighted orange lesion markers, warm color grading, hopeful optimistic atmosphere, deep blue and warm orange tones, clean minimal composition with copy space on left, no text, no watermark, 16:9 wide banner" 71
gen ai_reading "Photorealistic warm photograph, Taiwanese radiologist doctor in white coat reviewing AI-annotated CT scans on a modern workstation monitor, warm daylight from window, soft golden tones, focused professional with gentle smile, hospital radiology reading room, clean modern interior, no text, no watermark" 72
gen team_lab "Photorealistic warm photograph, Taiwanese medical AI research team collaborating in a bright modern laboratory, engineers and doctors discussing AI analysis on large screen, warm sunlight, genuine smiles, collaborative hopeful atmosphere, blue and orange accents, no text, no watermark" 73

echo "=== DONE ($(date +%H:%M:%S)) ==="
ls -la _gen/
