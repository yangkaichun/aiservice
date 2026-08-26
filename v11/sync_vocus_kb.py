#!/usr/bin/env python3
# 護胰大聯盟衛教知識庫 — vocus.cc room API 自動抓取同步
# v11.2.40：改用 room contents API 抓全（count=50，取代 __NEXT_DATA__ 前 20 篇限制）
# 流程：抓頁面 → 解析 roomId → 呼叫 API(num=50) → 更新 v11/assets/data-pancreas-kb.json + education.html 內嵌
import re, json, html as h, urllib.request, datetime, sys

PAGE_URL = "https://vocus.cc/salon/kcyang/room/PancreasCare"
API_URL = "https://api.vocus.cc/api/v2/site/rooms/{room_id}/contents?num=50&order=desc&page=1&roomId={room_id}&sort=publishAt&type="
OUT = "/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11/assets/data-pancreas-kb.json"

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0 Safari/537.36"

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "zh-TW,zh;q=0.9"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "ignore")

def get_room_id():
    """從頁面 __NEXT_DATA__ 的 fallback key 解析 roomId（形如 $inf$/api/v2/site/rooms/<id>/contents?...）"""
    t = fetch(PAGE_URL)
    m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', t, re.S)
    if not m:
        raise RuntimeError("頁面無 __NEXT_DATA__")
    d = json.loads(m.group(1))
    def find(o):
        if isinstance(o, dict):
            for k, v in o.items():
                mm = re.search(r"rooms/([0-9a-f]{20,})/contents", k)
                if mm:
                    return mm.group(1)
                r = find(v)
                if r:
                    return r
        elif isinstance(o, list):
            for v in o:
                r = find(v)
                if r:
                    return r
        return None
    room_id = find(d)
    if not room_id:
        raise RuntimeError("無法解析 roomId")
    return room_id

def fetch_articles(room_id):
    d = json.loads(fetch(API_URL.format(room_id=room_id)))
    arts = []
    for c in d.get("contents", []):
        a = c.get("article") or {}
        aid = a.get("_id") or c.get("_id")
        if not aid or not a.get("title"):
            continue
        item = {"id": aid, "title": h.unescape(a["title"]).strip()}
        if isinstance(a.get("abstract"), str) and a["abstract"]:
            item["abstract"] = h.unescape(a["abstract"]).strip()
        dt = c.get("publishAt") or a.get("updatedAt") or a.get("lastPublishAt")
        if dt:
            item["date"] = str(dt)[:10]
        if isinstance(a.get("thumbnailUrl"), str) and a["thumbnailUrl"].startswith("http"):
            item["cover"] = a["thumbnailUrl"]
        item["url"] = "https://vocus.cc/article/" + aid
        arts.append(item)
    return arts

def main():
    try:
        room_id = get_room_id()
    except Exception as e:
        print(f"❌ roomId 解析失敗: {e}")
        sys.exit(1)
    arts = fetch_articles(room_id)
    if not arts:
        print("❌ API 解析失敗（頁面結構變更或存取被擋）")
        sys.exit(1)
    arts.sort(key=lambda a: a.get("date", ""), reverse=True)
    data = {"source": PAGE_URL,
            "updated_at": datetime.datetime.now().astimezone().isoformat(timespec="seconds"),
            "count": len(arts), "articles": arts}
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    # 同步更新 education.html 內嵌資料（標記定位，避免弄丟）
    EDU = "/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11/education.html"
    try:
        eh = open(EDU, encoding="utf-8").read()
        embed = "/* __KB_EMBED__ */window.__KB__ = " + json.dumps(arts, ensure_ascii=False) + ";"
        pat = re.compile(r'<script>\s*/\* __KB_EMBED__ \*/.*?</script>', re.S)
        if pat.search(eh):
            # ⚠️ 必須用 function repl：re.sub 的字串 repl 會把字面 \n 解碼成真實換行
            #（embed 內 json.dumps 的轉義 \n 會被還原 → JSON 變非法 → 瀏覽器 SyntaxError）
            eh = pat.sub(lambda m: "<script>\n" + embed + "\n</script>", eh, count=1)
            open(EDU, "w", encoding="utf-8").write(eh)
            print("✅ education.html 內嵌資料已更新")
        else:
            print("⚠️ 找不到 __KB_EMBED__ 標記（內嵌未更新）")
    except Exception as e:
        print("⚠️ 內嵌更新失敗:", e)
    print(f"✅ 更新 {OUT}: {len(arts)} 篇（{data['updated_at']}）")
    for a in arts[:3]:
        print("  -", a["title"][:40])

if __name__ == "__main__":
    main()
