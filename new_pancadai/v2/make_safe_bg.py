#!/usr/bin/env python3
"""v2 Hero 安全版：1280x800 → 1280x720 (16:9) 模糊填補 + 人物完整置中
底層 = 原圖 cover 縮放 + 高斯模糊（填滿畫面）
上層 = 原圖 contain 縮放置中（人物不裁切）"""
import os
from PIL import Image, ImageFilter

ASSETS = '/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v2/assets'
TW = 1280; TH = 720  # 16:9

def safe(path, out):
    im = Image.open(path).convert('RGB')
    w, h = im.size
    # 底層：cover 填滿 + 模糊
    scale = max(TW / w, TH / h)
    bg = im.resize((int(w * scale) + 4, int(h * scale) + 4), Image.LANCZOS)
    bx = (bg.width - TW) // 2; by = (bg.height - TH) // 2
    bg = bg.crop((bx, by, bx + TW, by + TH)).filter(ImageFilter.GaussianBlur(28))
    # 上層：contain 置中 + 8% 安全邊距（人物絕不觸框）
    s = min(TW / w, TH / h) * 0.92
    fg = im.resize((int(w * s), int(h * s)), Image.LANCZOS)
    fg = fg.convert('RGBA')
    fg.putalpha(255)
    canvas = bg.convert('RGBA')
    canvas.paste(fg, ((TW - fg.width) // 2, (TH - fg.height) // 2), fg)
    canvas.convert('RGB').save(out, 'JPEG', quality=90)
    return (TW, TH)

count = 0
for f in sorted(os.listdir(ASSETS)):
    if f.endswith('.jpg') and (f.startswith('hero_sun_') or f.startswith('hero_intl_')) and '_safe' not in f and '_hd' not in f and 'small' not in f and 'med' not in f:
        out = f.replace('.jpg', '_safe.jpg')
        if os.path.exists(os.path.join(ASSETS, out)):
            print(f'  {f} → 已存在，跳過')
            continue
        sz = safe(os.path.join(ASSETS, f), os.path.join(ASSETS, out))
        count += 1
        print(f'  {f} → {out} {sz}')
print(f'完成 {count} 張')
