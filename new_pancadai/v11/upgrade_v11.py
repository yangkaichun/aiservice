#!/usr/bin/env python3
"""v11 全站批次升級：nav 9 連結 / footer 4 欄 + Line / 版本號 ?v=11 / ver v11.0.0"""
import re, glob

PAGES = [p for p in glob.glob("*.html") if p != "publications.html"]
print("處理頁面:", PAGES)

NAV_ADD = '\n      <a class="nav-a" href="publications.html" data-i18n="nav_pub">期刊論文</a>\n      <a class="nav-a" href="ip.html" data-i18n="nav_ip">智財布局</a>'
MOB_ADD = '\n  <a href="publications.html" data-i18n="nav_pub">期刊論文</a>\n  <a href="ip.html" data-i18n="nav_ip">智財布局</a>'

for fn in PAGES:
    s = open(fn, encoding="utf-8").read()
    orig = s

    # 1. nav-links 加期刊論文/智財（screening 之後）
    s = s.replace(
        '<a class="nav-a" href="screening.html" data-i18n="nav_screening">健檢中心</a>',
        '<a class="nav-a" href="screening.html" data-i18n="nav_screening">健檢中心</a>' + NAV_ADD, 1)
    # 2. mobile-menu 加期刊論文/智財
    s = s.replace(
        '<a href="screening.html" data-i18n="nav_screening">健檢中心</a>',
        '<a href="screening.html" data-i18n="nav_screening">健檢中心</a>' + MOB_ADD, 1)
    # 3. footer-brand 加 Line 連結
    s = s.replace(
        '<p data-i18n="foot_about">仲智數位健康股份有限公司（PanCAD.ai）— 以 AI 守護胰臟健康，讓早期發現不再遙遠。</p>',
        '<p data-i18n="foot_about">仲智數位健康股份有限公司（PanCAD.ai）— 以 AI 守護胰臟健康，讓早期發現不再遙遠。</p>\n      <a class="footer-line" href="https://lin.ee/pZJmfjl" target="_blank" rel="noopener" data-i18n="foot_line">加入護胰大聯盟官方 Line ↗</a>', 1)
    # 4. 產品與證據欄加期刊論文/智財
    s = s.replace(
        '<a href="clinician.html" data-i18n="foot_link_data">臨床數據</a>',
        '<a href="clinician.html" data-i18n="foot_link_data">臨床數據</a>\n      <a href="publications.html" data-i18n="foot_link_pub">期刊論文</a>\n      <a href="ip.html" data-i18n="foot_link_ip">智財布局</a>', 1)
    # 5. 聯絡資訊拆成第 4 欄（關閉第 3 欄再開新欄）
    s = s.replace(
        '<h4 style="margin-top:18px" data-i18n="foot_contact">聯絡資訊</h4>',
        '</div>\n    <div class="footer-col">\n      <h4 style="margin-top:0" data-i18n="foot_contact">聯絡資訊</h4>', 1)
    # 6. 版本號升 ?v=11
    s = re.sub(r'(css/style\.css)\?v=\d+', r'\1?v=11', s)
    s = re.sub(r'(js/(?:i18n|main)[a-z-]*\.js)\?v=\d+', r'\1?v=11', s)
    # 7. footer ver
    s = s.replace('v7.0.9', 'v11.0.0')

    if s != orig:
        open(fn, "w", encoding="utf-8").write(s)
        print(f"✅ {fn}")
    else:
        print(f"⚠️ 無變更 {fn}")
