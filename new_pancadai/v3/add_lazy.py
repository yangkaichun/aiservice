#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""效能批次：全站 <img> 加 loading=lazy + decoding=async；首頁 preload 首屏關鍵資源"""
import os, re

V3 = '/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v3'

# 首屏關鍵圖（不 lazy）：各頁 page-hero 背景與首屏內容
def add_lazy(path):
    html = open(path, encoding='utf-8').read()
    # 替換所有 <img ...> 加入 loading/decoding（若無）
    def repl(m):
        tag = m.group(0)
        if 'loading=' in tag:
            return tag
        # 檢查是否為首屏關鍵圖（logo、hero 首幀、分流卡）
        if 'logo.svg' in tag or 'hero_couple' in tag:
            return tag
        # 其他 img 加 lazy
        return tag.replace('<img ', '<img loading="lazy" decoding="async" ', 1)
    html = re.sub(r'<img [^>]*>', repl, html)
    open(path, 'w', encoding='utf-8').write(html)
    print(f"✅ lazy: {os.path.basename(path)}")

for fn in ['index.html', 'patient.html', 'clinician.html', 'about.html', 'news.html', 'contact.html']:
    add_lazy(os.path.join(V3, fn))

# 首頁 preload：hero 首幀 + logo + 分流卡背景
index_path = os.path.join(V3, 'index.html')
html = open(index_path, encoding='utf-8').read()
preloads = '''<!-- ===== 效能: 首屏資源 preload ===== -->
<link rel="preload" as="image" href="assets/hero_couple40.jpg">
<link rel="preload" as="image" href="assets/gate_patient.jpg">
<link rel="preload" as="image" href="assets/gate_clinician.jpg">
<!-- ===== END preload ===== -->
'''
if 'preload' not in html:
    insert_at = html.rfind('</head>')
    html = html[:insert_at] + preloads + html[insert_at:]
    open(index_path, 'w', encoding='utf-8').write(html)
    print("✅ preload: index.html")

# 檢查結果
print("\n=== lazy 統計 ===")
for fn in ['index.html', 'patient.html', 'clinician.html', 'about.html', 'news.html', 'contact.html']:
    h = open(os.path.join(V3, fn), encoding='utf-8').read()
    n = h.count('loading="lazy"')
    print(f"  {fn}: {n} lazy imgs")
