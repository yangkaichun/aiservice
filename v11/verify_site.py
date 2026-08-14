#!/usr/bin/env python3
"""pancad 家族交付前靜態驗證：node --check 全 JS + 資源完整性 + i18n key 覆蓋。
用法: python3 scripts/verify_site.py [站台目錄, 預設 .]
涵蓋 v6/v7 家族坑：href 的 ?v=N 需 strip 才不會誤報缺檔；
i18n 掃描解析 common + 每頁字典（Object.assign 合併模式），抓 HTML 用了但字典沒定義的 key。"""
import os, re, subprocess, glob, sys

root = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
errors = []

# 1. node --check 全 JS
for f in sorted(glob.glob(os.path.join(root, "js", "*.js"))):
    r = subprocess.run(["node", "--check", f], capture_output=True, text=True)
    if r.returncode != 0:
        errors.append(f"JS {os.path.basename(f)}: {r.stderr.strip()[:200]}")

# 2. 資源完整性（HTML src/href + CSS url；strip ?v=N；跳過錨點/外連/data:）
html_files = sorted(glob.glob(os.path.join(root, "*.html")))
refs = set()
for f in html_files:
    html = open(f, encoding="utf-8").read()
    for m in re.finditer(r'(?:src|href)="([^"#]+)"', html):
        refs.add((os.path.basename(f), m.group(1).split("?")[0]))
for f in glob.glob(os.path.join(root, "css", "*.css")):
    css = open(f, encoding="utf-8").read()
    for m in re.finditer(r'url\(([^)]+)\)', css):
        refs.add((os.path.basename(f), m.group(1).strip("'\"").split("?")[0]))
missing = [f"{p} -> {r}" for p, r in sorted(refs)
           if not r.startswith(("http", "mailto:", "data:")) and not os.path.exists(os.path.join(root, r))]

# 3. i18n key 覆蓋（common + 每頁字典合併後，檢查 data-i18n* 使用的 key 都有定義）
key_errs = []
for f in html_files:
    html = open(f, encoding="utf-8").read()
    used = set(re.findall(r'data-i18n(?:-html|-ph)?="([^"]+)"', html))
    page = os.path.basename(f).replace(".html", "")
    dicts = [open(os.path.join(root, "js", "i18n-common.js"), encoding="utf-8").read()]
    dpath = os.path.join(root, "js", f"i18n-{page}.js")
    if os.path.exists(dpath):
        dicts.append(open(dpath, encoding="utf-8").read())
    defined = set()
    for d in dicts:
        defined |= set(re.findall(r'^\s{4}([a-zA-Z0-9_]+):\s*["\u201c]', d, re.M))
        defined |= set(re.findall(r',\s*([a-zA-Z0-9_]+):\s*["\u201c]', d))
    mk = used - defined
    if mk:
        key_errs.append(f"{page}: {sorted(mk)}")

print("JS syntax:", "OK" if not errors else errors)
print("Resources:", f"{len(refs)} refs,", "OK" if not missing else missing)
print("i18n keys:", "OK" if not key_errs else key_errs)
if errors or missing or key_errs:
    sys.exit(1)
