#!/usr/bin/env python3
"""v9 全站驗證：資源 / JS 語法 / i18n key / 頁面結構"""
import os, re, subprocess, sys, glob

HERE = os.path.dirname(os.path.abspath(__file__))
errors = []
warnings = []

pages = [f for f in glob.glob(os.path.join(HERE, '*.html')) if not f.endswith('_bak.html')]

# 1. 每頁引用的本地資源是否存在
for p in pages:
    html = open(p).read()
    name = os.path.basename(p)
    for m in re.finditer(r'(?:src|href)="((?!https?:|#|mailto:|data:)[^"]+)"', html):
        ref = m.group(1).split('?')[0].split('#')[0]
        if not ref or ref.startswith('javascript:'):
            continue
        path = os.path.normpath(os.path.join(HERE, ref))
        if not os.path.exists(path):
            errors.append(f'{name}: 缺資源 {ref}')

# 2. JS 語法檢查
for j in glob.glob(os.path.join(HERE, 'js', '*.js')):
    r = subprocess.run(['node', '--check', j], capture_output=True, text=True)
    if r.returncode != 0:
        errors.append(f'{os.path.basename(j)}: JS 語法錯誤 {r.stderr.strip()[:200]}')

# 3. i18n key 完整性：每頁 data-i18n* 的 key 是否都存在於字典
for p in pages:
    html = open(p).read()
    name = os.path.basename(p).replace('.html', '')
    page_js = os.path.join(HERE, 'js', f'i18n-{name}.js')
    if name == 'index':
        page_js = os.path.join(HERE, 'js', 'i18n-index.js')
    keys = set()
    for m in re.finditer(r'data-i18n(?:-html|-ph)?="([^"]+)"', html):
        keys.add(m.group(1))
    dict_src = ''
    if os.path.exists(page_js):
        dict_src = open(page_js).read()
    # 也檢查 common 字典（nav/footer 用）
    common_src = open(os.path.join(HERE, 'js', 'i18n-common.js')).read()
    all_src = dict_src + common_src
    for k in sorted(keys):
        # 字典檔內應有 zh 的定義（支援 key: / 'key': / "key": 三種寫法）
        if (f"'{k}':" not in all_src and f'"{k}":' not in all_src
                and re.search(r'\b' + re.escape(k) + r'\s*:', all_src) is None):
            warnings.append(f'{name}.html: data-i18n key "{k}" 不在字典中')

# 4. 首頁必備區塊
idx = open(os.path.join(HERE, 'index.html')).read()
for block in ['hero', 'plight', 'case', 'journey', 'hope', 'live', 'certs', 'gates', 'cta-band', 'footer']:
    if f'class="{block}' not in idx and f'id="{block}' not in idx:
        errors.append(f'index.html: 缺區塊 {block}')

# 5. 資源大小總覽
video_total = sum(os.path.getsize(f) for f in glob.glob(os.path.join(HERE, 'video', '*'))) // 1024
print(f'頁面: {len(pages)} 個')
print(f'影片總量: {video_total} KB')
if errors:
    print(f'\n❌ {len(errors)} 個錯誤:')
    for e in errors: print('  -', e)
    sys.exit(1)
if warnings:
    print(f'\n⚠️ {len(warnings)} 個警告:')
    for w in warnings: print('  -', w)
print('\n✅ 驗證通過：資源全齊、JS 語法全過、結構完整')
