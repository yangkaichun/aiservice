#!/bin/bash
# v11.2.18: 產品頁系統架構圖重新生成（2560 穩定產線）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11
mkdir -p _gen_v11
MFX="$HOME/.local/bin/mflux-generate-z-image-turbo"

PROMPT="Modern medical AI product illustration, abstract technology composition for PANCREASaver pancreatic cancer detection AI system: central radar-style target lock ring locking onto a small glowing orange dot representing a lesion, concentric blue scanning waves radiating outward, four clean workflow nodes arranged around the center with ENGLISH labels - 'CT Scan', 'AI Analysis', 'Lesion Detected', 'Doctor Alert' - connected by smooth glowing lines with small icons, dark navy blue medical-technology background, brand blue and orange accent colors, NO medical imaging, NO CT scan images, NO body parts, flat modern vector style, wide 16:9 composition, premium product render"

echo "=== [system_arch] 生成 $(date '+%H:%M:%S') ==="
PYTHONPATH= "$MFX" --output "_gen_v11/system_arch_raw.jpg" --width 2560 --height 1440 --steps 4 --seed $RANDOM --prompt "$PROMPT" > "_gen_v11/system_arch.log" 2>&1
tail -c 200 "_gen_v11/system_arch.log" | tr -d '\r' | tail -1
echo "=== 後處理：1920 jpg 覆蓋 ==="
PYTHONPATH= ffmpeg -y -loglevel error -i "_gen_v11/system_arch_raw.jpg" -vf "scale=1920:1080:flags=lanczos" -q:v 2 "assets/system_arch.jpg"
echo "=== DONE $(date '+%H:%M:%S') ==="
ls -la assets/system_arch.jpg | awk '{print $9, $5"B"}'
