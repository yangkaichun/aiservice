#!/usr/bin/env python3
# v11.2.20：raw（1600 無 pad）→ 1280 小圖 + HD webp
import os
from PIL import Image
os.chdir("/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11/assets")
JOBS = [
    ("hero_sun_1", "hero_sun_1_raw.jpg"), ("hero_sun_2", "hero_sun_2_raw.jpg"),
    ("hero_sun_3", "hero_sun_3_raw.jpg"), ("hero_sun_4", "hero_sun_4_raw.jpg"),
    ("hero_sun_5", "hero_sun_5_raw.jpg"), ("hero_sun_6", "hero_sun_6_raw.jpg"),
    ("hero_sun_7", "hero_sun_7_raw.jpg"), ("hero_sun_8", "hero_sun_8_raw.jpg"),
    ("hero_sun_9", "hero_sun_9_raw.jpg"), ("hero_sun_10", "hero_sun_10_raw.jpg"),
    ("ct_scan_bed", "ct_scan_bed_raw.jpg"), ("dinner_zh_1", "dinner_zh_1_raw.jpg"),
    ("dinner_zh_2", "dinner_zh_2_raw.jpg"), ("dinner_ja_1", "dinner_ja_1_raw.jpg"),
    ("dinner_ja_2", "dinner_ja_2_raw.jpg"), ("dinner_en_1", "dinner_en_1_raw.jpg"),
    ("dinner_en_2", "dinner_en_2_raw.jpg"),
]
for name, raw in JOBS:
    p = f"_gen_v11/{raw}"
    if not os.path.exists(p):
        print(f"skip {name}"); continue
    im = Image.open(p).convert("RGB")
    # 1280 小圖（無 pad，直接縮放）
    small = im.resize((1280, int(1280 * im.height / im.width)), Image.LANCZOS)
    small.save(f"{name}_safe.jpg", quality=88)
    # HD webp（raw 尺寸）
    im.save(f"{name}_safe_hd.webp", "WEBP", quality=84, method=6)
    print(f"✓ {name} ({im.width}x{im.height})")
print("=== NO-PAD BATCH DONE ===")
