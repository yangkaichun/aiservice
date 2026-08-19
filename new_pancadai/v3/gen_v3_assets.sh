#!/bin/bash
# v3 新圖批次：分流卡×2 + 醫療軌頁首×1 + 患者軌檢查幕×1
# 每張 ~2.5min，背景執行 + notify_on_complete
set -e
cd "$(dirname "$0")"
mkdir -p _gen
MFLUX="$HOME/.local/bin/mflux-generate-z-image-turbo"

gen() {
  local out="$1"; shift
  if [ -f "$out" ]; then echo "SKIP (exists): $out"; return; fi
  PYTHONPATH= "$MFLUX" "$@" --output "$out"
  echo "DONE: $out"
}

# 1. 分流卡-患者向（溫暖、40歲台灣夫妻、陽光）
gen "assets/gate_patient.jpg" \
  --prompt "Photorealistic warm photograph, happy Taiwanese couple in their early 40s walking together on a green hilltop meadow at golden sunrise, arms around each other, genuine bright smiles, healthy energetic hopeful mood, high-key warm tone, soft sun rays, copy space on left side, no text, no watermark, 16:9 wide banner" \
  --width 1280 --height 800 --steps 9 -q 8 --seed 101

# 2. 分流卡-機構向（科技、醫學影像 AI）
gen "assets/gate_clinician.jpg" \
  --prompt "Futuristic medical AI visualization, transparent 3D human torso with glowing pancreas highlighted in cyan, neural network nodes and data streams, deep blue and cyan holographic interface on dark navy background, high-tech radiology workstation aesthetic, precise professional mood, copy space on left, no text, no watermark, 16:9 wide banner" \
  --width 1280 --height 800 --steps 9 -q 8 --seed 202

# 3. 醫療軌頁首（AI 判讀工作站）
gen "assets/clinician_hero.jpg" \
  --prompt "Modern radiology reading room at dusk, large medical display showing abdominal CT scan with AI highlighted lesion in cyan box, radiologist silhouette analyzing images, deep blue ambient lighting with cyan accents, professional medical technology atmosphere, cinematic wide shot, no text, no watermark, 16:9 wide banner" \
  --width 1600 --height 900 --steps 9 -q 8 --seed 303

# 4. 患者軌-檢查幕（CT 掃描體驗）
gen "assets/patient_ct.jpg" \
  --prompt "Photorealistic modern hospital CT examination room, patient lying in CT scanner machine with soft white and blue lighting, gentle warm light rays, calm reassuring atmosphere, medical technology that feels human and approachable, clean composition with copy space, no text, no watermark, 16:9 wide banner" \
  --width 1280 --height 800 --steps 9 -q 8 --seed 404

echo "ALL DONE"
