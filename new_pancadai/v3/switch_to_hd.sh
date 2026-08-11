#!/bin/bash
# 放大完成後：把各頁背景引用切換到 _hd 版
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

# 各頁替換
sed -i '' "s/gate_patient\.jpg/gate_patient_hd.jpg/g; s/gate_clinician\.jpg/gate_clinician_hd.jpg/g" index.html
sed -i '' "s/patient_ct\.jpg/patient_ct_hd.jpg/g; s/ai_workstation\.jpg/ai_workstation_hd.jpg/g" patient.html
sed -i '' "s/clinician_hero\.jpg/clinician_hero_hd.jpg/g" clinician.html
sed -i '' "s/team_lab\.jpg/team_lab_hd.jpg/g" about.html
sed -i '' "s/ai_reading\.jpg/ai_reading_hd.jpg/g" news.html
sed -i '' "s/ai_workstation\.jpg/ai_workstation_hd.jpg/g" contact.html
# CSS fallback（hero 首幀）
sed -i '' "s/hero_couple40\.jpg/hero_couple40_hd.jpg/g" css/style.css

echo "=== 替換完成，確認:"
grep -o "assets/[a-z_]*_hd\.jpg" index.html patient.html clinician.html about.html news.html contact.html css/style.css | sort -u
