#!/usr/bin/env python3
# 護胰大聯盟衛教知識庫 — vocus.cc 自動抓取同步
# 抓取 https://vocus.cc/salon/kcyang/room/PancreasCare 文章清單 → 更新 v11/assets/data-pancreas-kb.json
import re, json, html as h, urllib.request, datetime, sys

URL = "https://vocus.cc/salon/kcyang/room/PancreasCare"
OUT = "/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11/assets/data-pancreas-kb.json"

def fetch():
    req = urllib.request.Request(URL, headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0 Safari/537.36",
        "Accept-Language": "zh-TW,zh;q=0.9"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "ignore")

def parse(t):
    m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', t, re.S)
    if not m:
        return []
    d = json.loads(m.group(1))
    found = {}
    def walk(o):
        if isinstance(o, dict):
            if "_id" in o and isinstance(o.get("title"), str) and len(o["title"]) > 8:
                item = {"id": o["_id"], "title": h.unescape(o["title"]).strip()}
                if isinstance(o.get("abstract"), str) and o["abstract"]:
                    item["abstract"] = h.unescape(o["abstract"]).strip()
                if o.get("createdAt"):
                    item["date"] = str(o["createdAt"])[:10]
                # 封面圖（v11.2.31：方格子貼圖同步）
                for ck in ("thumbnailUrl", "coverUrl", "heroImage"):
                    if isinstance(o.get(ck), str) and o[ck].startswith("http"):
                        item["cover"] = o[ck]
                        break
                # 優先保留含封面圖的版本（列表節點可能覆蓋詳情節點）
                if o["_id"] not in found or ("cover" in item and not found[o["_id"]].get("cover")):
                    found[o["_id"]] = item
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    walk(d)
    arts = []
    for it in found.values():
        it["url"] = "https://vocus.cc/article/" + it["id"]
        arts.append(it)
    return arts

def main():
    t = fetch()
    arts = parse(t)
    if not arts:
        print("❌ 解析失敗（頁面結構變更或存取被擋）")
        sys.exit(1)
    arts.sort(key=lambda a: a.get("date", ""), reverse=True)
    data = {"source": "https://vocus.cc/salon/kcyang/room/PancreasCare",
            "updated_at": datetime.datetime.now().astimezone().isoformat(timespec="seconds"),
            "count": len(arts), "articles": arts}
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    # v11.2.32：同步更新 education.html 內嵌資料（保證無 fetch 也顯示最新）
    EDU = "/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11/education.html"
    try:
        eh = open(EDU, encoding="utf-8").read()
        embed = "window.__KB__ = " + json.dumps(arts, ensure_ascii=False) + ";"
        if "window.__KB__" in eh:
            eh = re.sub(r'window\.__KB__ = .*?;', embed, eh, count=1, flags=re.S)
            open(EDU, "w", encoding="utf-8").write(eh)
            print("✅ education.html 內嵌資料已更新")
    except Exception as e:
        print("⚠️ 內嵌更新失敗:", e)
    print(f"✅ 更新 {OUT}: {len(arts)} 篇（{data['updated_at']}）")
    for a in arts[:3]:
        print("  -", a["title"][:40])

if __name__ == "__main__":
    main()
