#!/usr/bin/env python3
"""v8 黎明之光 — 7 個內頁統一升級：
1. page-hero 加 rays_light 動態背景（data-bg-video）+ dawn-glow
2. cta-band 加 scan_beam 動態背景
3. footer 版號 → v8.1.0
4. 全頁版本號 → ?v=3（統一）
"""
import re, os
os.chdir('/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v8')

PAGES = ['product.html','evidence.html','patient.html','clinician.html','about.html','contact.html','news.html']

for p in PAGES:
    s = open(p).read()
    orig = s

    # 1. page-hero：在 <header class="page-hero" data-scanline> 後插入動態背景影片層 + dawn-glow
    if 'bg-video' not in s and 'page-hero' in s:
        s = re.sub(
            r'(<header class="page-hero" data-scanline>\s*\n)(\s*<div class="bg")',
            r'\1  <div class="dawn-glow"></div>\n\2',
            s, count=1)
        s = re.sub(
            r'(<header class="page-hero"[^>]*>\s*\n\s*<div class="dawn-glow"></div>\s*\n)',
            r'\1  <div class="bg-video" data-bg-video="rays_light"><div class="poster" style="background-image:url(\'video/poster_rays.jpg\')"></div></div>\n',
            s, count=1)

    # 2. cta-band：加 scan_beam 動態背景
    if 'scan_beam' not in s and 'cta-band' in s:
        s = re.sub(
            r'(<section class="cta-band" data-scanline>\s*\n)',
            r'\1  <div class="bg-video" data-bg-video="scan_beam"><div class="poster" style="background-image:url(\'video/poster_rays.jpg\')"></div></div>\n',
            s, count=1)

    # 3. footer 版號
    s = s.replace('>v8.0.0<', '>v8.1.0<')

    if s != orig:
        open(p, 'w').write(s)
        print(f'✓ {p} updated')
    else:
        print(f'· {p} unchanged')
print('DONE')
