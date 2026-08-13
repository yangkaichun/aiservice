#!/bin/bash
# v11.2: 生成 CT 掃描擬真示意圖（patient 幕3 固定圖，不進隨機池）
set -e
cd /Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11/assets
GEN="$HOME/.local/bin/mflux-generate-z-image-turbo"
OUT="_gen_v11/ct_scan_bed_raw.jpg"

if [ ! -f "$OUT" ]; then
  echo "=== CT scan bed generating... $(date '+%H:%M:%S') ==="
  PYTHONPATH= "$GEN" --model z-image-turbo --width 1600 --height 900 --steps 9 --guidance 4.5 \
    --seed 20260813 --prompt "Photorealistic photograph inside a modern hospital CT scanning room, a Taiwanese man in his 40s lying comfortably on the CT scanner bed with the large white CT gantry ring arching above his abdomen, soft cool-blue medical ambient lighting, radiology technologist softly blurred in the background preparing the scan, clean high-tech medical environment, calm reassuring atmosphere, cinematic wide composition, no text, no watermark, 16:9 wide banner" \
    --output "$OUT"
  echo "=== CT done $(date '+%H:%M:%S') ==="
fi

# 安全版（×0.88 blur-pad，防 nav 切人物）→ 1280×720
ffmpeg -y -i "$OUT" -filter_complex \
"[0:v]split=2[bg][fg];[bg]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=30:4[bgblur];\
[fg]scale=1408:792[fgsc];[bgblur][fgsc]overlay=(W-w)/2:(H-h)/2,scale=1280:720,format=yuv420p" \
-frames:v 1 ct_scan_bed_safe.jpg
echo "=== safe done ==="
ls -la ct_scan_bed_safe.jpg

# HD：SeedVR2 兩階段（1280×720 → 2560×1440 → 5120×2880）
UP="$HOME/.local/bin/mflux-upscale-seedvr2"
if [ ! -f ct_scan_bed_safe_hd.webp ]; then
  echo "=== CT HD 階段1 (2560) $(date '+%H:%M:%S') ==="
  PYTHONPATH= "$UP" --image-path ct_scan_bed_safe.jpg --resolution 2x --output _tmp_ct_hd1.jpg 2>&1 | tail -1
  echo "=== CT HD 階段2 (5120) $(date '+%H:%M:%S') ==="
  PYTHONPATH= "$UP" --image-path _tmp_ct_hd1.jpg --resolution 2x --output ct_scan_bed_safe_hd.webp 2>&1 | tail -1
  rm -f _tmp_ct_hd1.jpg
fi
echo "=== CT ALL DONE $(date '+%H:%M:%S') ==="
ls -la ct_scan_bed_safe.*
