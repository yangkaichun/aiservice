#!/usr/bin/env python3
"""v12 全站批次升級工具：升 ?v=N（快取破壞）＋ footer .ver 版本號。

用法：python3 upgrade_v12.py <新?v數字> <新ver字串>
例：python3 upgrade_v12.py 2 v12.0.1
（歷史：v11 版本曾含 nav/footer 結構批次替換，已隨 v11 完成而移除。）
"""
import re, sys, glob

NEW_QV = sys.argv[1] if len(sys.argv) > 1 else "1"
NEW_VER = sys.argv[2] if len(sys.argv) > 2 else "v12.0.0"

for fn in glob.glob("*.html"):
    s = open(fn, encoding="utf-8").read()
    s2 = re.sub(r"(css/style\.css)\?v=\d+", r"\1?v=" + NEW_QV, s)
    s2 = re.sub(r"(js/(?:i18n|main)[a-z-]*\.js)\?v=\d+", r"\1?v=" + NEW_QV, s2)
    s2 = re.sub(r'class="ver">[^<]+', 'class="ver">' + NEW_VER, s2)
    if s2 != s:
        open(fn, "w", encoding="utf-8").write(s2)
        print(f"{fn}: ?v={NEW_QV} / ver={NEW_VER}")
print("完成")
