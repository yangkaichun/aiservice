#!/bin/bash
# 生成 ACT03 人體器官擬真示意圖 + ACT04 胰臟擬真示意圖
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v5/assets

export PYTHONPATH=

echo "[1/2] 生成 ACT03 人體腹部器官擬真圖..."
PYTHONPATH= ~/.local/bin/mflux-generate-z-image-turbo \
  --model z-image-turbo \
  --prompt "Photorealistic medical 3D anatomy visualization, human torso transparent semi-cutaway view showing abdominal organs, pancreas highlighted with glowing cyan-blue holographic light at center, stomach and duodenum visible in translucent medical rendering, dark navy blue background, soft volumetric light, high-resolution medical imaging aesthetic, clean clinical look, no text, no watermark, no labels, no arrows, 16:9 wide banner" \
  --width 1600 --height 900 \
  --steps 9 --guidance 4.5 \
  --seed 20260811 \
  --output act03_organs.png

echo "[2/2] 生成 ACT04 胰臟擬真示意圖..."
PYTHONPATH= ~/.local/bin/mflux-generate-z-image-turbo \
  --model z-image-turbo \
  --prompt "Photorealistic high-resolution 3D medical illustration of a human pancreas, realistic anatomical detail with blood vessels and pancreatic duct, translucent glowing cyan-blue rim light on dark navy black background, cinematic volumetric lighting, scientific medical render like textbook diagram, subtle warm orange accent glow on tissue, no text, no watermark, no labels, no arrows, no lesion markers, 16:9 wide banner" \
  --width 1600 --height 900 \
  --steps 9 --guidance 4.5 \
  --seed 20260812 \
  --output act04_pancreas.png

echo "DONE"
ls -la act03_organs.png act04_pancreas.png
