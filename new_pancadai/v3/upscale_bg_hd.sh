#!/bin/bash
# v3 背景圖 SeedVR2 放大批次 — 兩階段 2x→2x（1280→2560→5120 級）
# 背景圖填滿視窗用：gate/hero/page-hero/chapter 全部背景
set -e
cd "$(dirname "$0")/assets"

# 放大目標清單（已有 _hd 的跳過）
FILES=(
  gate_patient.jpg
  gate_clinician.jpg
  clinician_hero.jpg
  patient_ct.jpg
  team_lab.jpg
  ai_reading.jpg
  ai_workstation.jpg
  ai_hologram.jpg
  hero_couple40.jpg
  hero_man40.jpg
  hero_woman40.jpg
)

for src in "${FILES[@]}"; do
  base="${src%.jpg}"
  hd="${base}_hd.jpg"
  if [ -f "$hd" ]; then
    echo ">>> ${src} 已有 HD，跳過"
    continue
  fi
  echo ">>> ${src} 階段1 (2x) $(date +%H:%M:%S)"
  PYTHONPATH= ~/.local/bin/mflux-upscale-seedvr2 --image-path "$src" --resolution 2x --output "_tmp_hd1.jpg" 2>&1 | tail -1
  echo ">>> ${src} 階段2 (4x) $(date +%H:%M:%S)"
  PYTHONPATH= ~/.local/bin/mflux-upscale-seedvr2 --image-path "_tmp_hd1.jpg" --resolution 2x --output "$hd" 2>&1 | tail -1
  rm -f _tmp_hd1.jpg
  sips -g pixelWidth -g pixelHeight "$hd" 2>/dev/null | grep pixel | awk '{printf "%s ", $2}' | xargs echo "    ${hd}:"
done
echo "=== ALL DONE ($(date +%H:%M:%S)) ==="
