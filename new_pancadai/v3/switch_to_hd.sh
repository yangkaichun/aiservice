#!/bin/bash
# 放大完成後：把各頁背景引用切換到 HD 版（webp 優先，jpg fallback）
cd "$(dirname "$0")"

# 確認所有 HD 檔存在
MISSING=0
for f in gate_patient_hd gate_clinician_hd clinician_hero_hd patient_ct_hd team_lab_hd ai_reading_hd ai_workstation_hd ai_hologram_hd hero_couple40_hd hero_man40_hd hero_woman40_hd; do
  if [ ! -f "assets/${f}.jpg" ]; then
    echo "❌ 缺: ${f}.jpg"
    MISSING=1
  fi
done
if [ "$MISSING" = "1" ]; then echo "尚有未完成放大，中止替換"; exit 1; fi

# 把放大完成的 jpg 轉 webp（若無）
for f in gate_patient_hd gate_clinician_hd clinician_hero_hd patient_ct_hd team_lab_hd ai_reading_hd ai_workstation_hd ai_hologram_hd hero_couple40_hd hero_man40_hd hero_woman40_hd; do
  if [ ! -f "assets/${f}.webp" ]; then
    cwebp -q 80 "assets/${f}.jpg" -o "assets/${f}.webp" >/dev/null 2>&1 && echo "  webp: ${f}.webp"
  fi
done

# 各頁替換（優先 webp）
sed -i '' "s/gate_patient\.jpg/gate_patient_hd.webp/g; s/gate_clinician\.jpg/gate_clinician_hd.webp/g" index.html
sed -i '' "s/patient_ct\.jpg/patient_ct_hd.webp/g; s/ai_workstation\.jpg/ai_workstation_hd.webp/g" patient.html
sed -i '' "s/clinician_hero\.jpg/clinician_hero_hd.webp/g" clinician.html
sed -i '' "s/team_lab\.jpg/team_lab_hd.webp/g" about.html
sed -i '' "s/ai_reading\.jpg/ai_reading_hd.webp/g" news.html
sed -i '' "s/ai_workstation\.jpg/ai_workstation_hd.webp/g" contact.html
# CSS fallback（hero 首幀）
sed -i '' "s/hero_couple40\.jpg/hero_couple40_hd.webp/g" css/style.css

echo "=== 替換完成，確認:"
grep -o "assets/[a-z_]*_hd\.webp" index.html patient.html clinician.html about.html news.html contact.html css/style.css | sort -u
