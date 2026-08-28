#!/usr/bin/env python3
"""pancad 家族交付前靜態驗證：node --check 全 JS + 資源完整性 + i18n key 覆蓋。
用法: python3 scripts/verify_site.py [站台目錄, 預設 .]
涵蓋 v6/v7 家族坑：href 的 ?v=N 需 strip 才不會誤報缺檔；
i18n 掃描解析 common + 每頁字典（Object.assign 合併模式），抓 HTML 用了但字典沒定義的 key。"""
import json, os, re, subprocess, glob, sys

root = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
errors = []

# 1. node --check 全 JS
for f in sorted(glob.glob(os.path.join(root, "js", "*.js"))):
    r = subprocess.run(["node", "--check", f], capture_output=True, text=True)
    if r.returncode != 0:
        errors.append(f"JS {os.path.basename(f)}: {r.stderr.strip()[:200]}")

# 2. 資源完整性（HTML src/href + CSS url；依來源檔案解析相對路徑）
#    同時掃描 /en/ 與 /jp/；deep-plan 是獨立 zh-only 子站，不套用本頁驗收。
html_files = sorted(glob.glob(os.path.join(root, "*.html")))
for lang_dir in ("en", "jp"):
    html_files.extend(glob.glob(os.path.join(root, lang_dir, "*.html")))
html_files = sorted(html_files)
refs = set()
for f in html_files:
    html = open(f, encoding="utf-8").read()
    for m in re.finditer(r'(?:src|href)="([^"#]+)"', html):
        ref = m.group(1).split("?")[0]
        # Inline JS templates such as href="' + a.url + '" are not files.
        if any(token in ref for token in (" + ", "${", "' +", '" +')):
            continue
        refs.add((f, ref))
for f in glob.glob(os.path.join(root, "css", "*.css")):
    css = open(f, encoding="utf-8").read()
    for m in re.finditer(r'url\(([^)]+)\)', css):
        refs.add((f, m.group(1).strip("'\"").split("?")[0]))
missing = []
for source, ref in sorted(refs):
    if ref.startswith(("http", "mailto:", "data:", "javascript:", "#")):
        continue
    target = os.path.normpath(os.path.join(os.path.dirname(source), ref))
    if not os.path.exists(target):
        missing.append(f"{os.path.relpath(source, root)} -> {ref}")

# 3. i18n key 覆蓋（common + 每頁字典合併後，檢查 data-i18n* 使用的 key 都有定義）
key_errs = []
seo_errs = []
def public_url(f):
    rel = os.path.relpath(f, root).replace(os.sep, "/")
    parts = rel.split("/")
    if parts[0] in ("en", "jp"):
        prefix = "/" + parts[0]
        stem = parts[1]
    else:
        prefix = ""
        stem = parts[0]
    return "https://pancad.ai" + prefix + ("/" if stem == "index.html" else "/" + stem)

for f in html_files:
    html = open(f, encoding="utf-8").read()
    page = os.path.relpath(f, root)
    h1_count = len(re.findall(r'<h1\b', html, re.I))
    if h1_count != 1:
        seo_errs.append(f"{page}: expected 1 h1, found {h1_count}")
    canonical = re.search(r'<link\b[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)', html, re.I)
    if not canonical:
        seo_errs.append(f"{page}: missing canonical")
    elif canonical.group(1) != public_url(f):
        seo_errs.append(f"{page}: canonical mismatch ({canonical.group(1)})")
    hreflang = dict(re.findall(r'<link\b[^>]*hreflang=["\']([^"\']+)["\'][^>]*href=["\']([^"\']+)', html, re.I))
    page_path = "" if os.path.basename(f) == "index.html" else os.path.basename(f)
    expected_hreflang = {
        "zh-TW": "https://pancad.ai/" + page_path,
        "en": "https://pancad.ai/en/" + page_path,
        "ja": "https://pancad.ai/jp/" + page_path,
        "x-default": "https://pancad.ai/" + page_path,
    }
    if set(hreflang) != set(expected_hreflang) or any(hreflang.get(k) != v for k, v in expected_hreflang.items()):
        seo_errs.append(f"{page}: hreflang mismatch")
    if len(hreflang) < 4:
        seo_errs.append(f"{page}: incomplete hreflang set")
    for block in re.findall(r'<script\b[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', html, re.I | re.S):
        try:
            json.loads(block.strip())
        except json.JSONDecodeError as exc:
            seo_errs.append(f"{page}: invalid JSON-LD ({exc.msg})")
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
print("SEO/GEO structure:", "OK" if not seo_errs else seo_errs)
if errors or missing or key_errs or seo_errs:
    sys.exit(1)
