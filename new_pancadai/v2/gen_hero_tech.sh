#!/bin/bash
# v2 Hero 科技卡 — 醫學影像 AI 公司風格圖（mflux 本地生成）
OUT="/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v2/assets"
cd "$OUT"
mkdir -p _gen

gen() {
  echo ">>> $1 ($(date +%H:%M:%S))"
  PYTHONPATH= ~/.local/bin/mflux-generate-z-image-turbo --prompt "$2" --width 1024 --height 1024 --steps 9 -q 8 --seed "$3" --output "_gen/$1.jpg" 2>&1 | tail -2
}

gen ai_hologram "Futuristic medical AI visualization, transparent 3D human torso with glowing pancreas organ highlighted, digital data streams and neural network nodes connecting around it, deep blue and cyan holographic interface, elegant scientific aesthetic, dark navy background, cinematic lighting, premium biotech company feel, no text, no watermark" 81
gen ai_neural "Abstract AI deep learning visualization for medical imaging, neural network layers analyzing organ scan data, glowing blue and gold connection lines, holographic medical interface elements, dark navy background with subtle grid, premium tech aesthetic, no text, no watermark" 82
gen ai_workstation "Modern medical imaging AI company visual, sleek holographic radiology analysis screen with abstract organ hologram, cyan light beams and data particles, dark blue futuristic environment, professional scientific atmosphere, clean composition, no text, no watermark" 83

echo "=== DONE ($(date +%H:%M:%S)) ==="
ls -la _gen/
