#!/usr/bin/env python3
# v11.2.22：38 張新 raw（2560 無 pad）→ 1280 小圖 + 2560 HD webp
import os
from PIL import Image
os.chdir("/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11/assets")
NAMES = [
    "hero_sun_bike", "hero_sun_bridge", "hero_sun_coffee", "hero_sun_forest",
    "hero_sun_kayak", "hero_sun_picnic", "hero_sun_yoga",
    "hero_v7_morning_intl",
] + ["hero_intl_%02d" % i for i in range(1, 31)]
ok = 0
for name in NAMES:
    p = f"../_gen_v11/{name}_raw.jpg"
    if not os.path.exists(p):
        print(f"skip {name}"); continue
    im = Image.open(p).convert("RGB")
    small = im.resize((1280, int(1280 * im.height / im.width)), Image.LANCZOS)
    small.save(f"{name}_safe.jpg", quality=88)
    im.save(f"{name}_safe_hd.webp", "WEBP", quality=84, method=6)
    ok += 1
print(f"=== NO-PAD BATCH2 DONE: {ok}/38 ===")
