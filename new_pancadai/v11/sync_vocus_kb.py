#!/usr/bin/env python3
"""Synchronize the public PancreasCare room into an isolated or local site."""
import argparse
import datetime as dt
import html
import json
import os
from pathlib import Path
import re
import tempfile
import urllib.request
from urllib.parse import urlparse

PAGE_URL = "https://vocus.cc/salon/kcyang/room/PancreasCare"
API_URL = "https://api.vocus.cc/api/v2/site/rooms/{room_id}/contents?num=50&order=desc&page={page}&roomId={room_id}&sort=publishAt&type="
TAIPEI = dt.timezone(dt.timedelta(hours=8))
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0 Safari/537.36"
EMBED = re.compile(r"<script>\s*/\* __KB_EMBED__ \*/.*?</script>", re.S)
NOSCRIPT = re.compile(r'(<div id="kbList"[^>]*>\s*)<noscript>.*?</noscript>', re.S)


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "zh-TW,zh;q=0.9"})
    with urllib.request.urlopen(req, timeout=30) as response:
        return response.read().decode("utf-8")


def get_room_id():
    match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', fetch(PAGE_URL), re.S)
    if not match:
        raise ValueError("Source page has no __NEXT_DATA__")
    data = json.loads(match.group(1))

    def find(value):
        if isinstance(value, dict):
            for key, child in value.items():
                found = re.search(r"rooms/([0-9a-f]{24})/contents", key)
                if found:
                    return found.group(1)
                found = find(child)
                if found:
                    return found
        elif isinstance(value, list):
            for child in value:
                found = find(child)
                if found:
                    return found
        return None

    room_id = find(data)
    if not room_id:
        raise ValueError("Source page has no room ID")
    return room_id


def timestamp(value):
    if not isinstance(value, str):
        raise ValueError("Missing publication timestamp")
    normalized = value.replace("Z", "+00:00")
    # Python 3.9 requires fractional seconds to have 3 or 6 digits.
    normalized = re.sub(r"\.(\d{1,6})(?=[+-]\d{2}:\d{2}$)", lambda match: "." + match.group(1).ljust(6, "0"), normalized)
    parsed = dt.datetime.fromisoformat(normalized)
    if parsed.tzinfo is None:
        raise ValueError("Publication timestamp must include a timezone")
    return parsed.astimezone(TAIPEI)


def valid_cover(value):
    if not isinstance(value, str):
        return False
    url = urlparse(value)
    return url.scheme == "https" and url.hostname == "images.vocus.cc"


def fetch_articles(room_id, now=None):
    now = now or dt.datetime.now(TAIPEI)
    records = []
    total = None
    for page in range(1, 101):
        data = json.loads(fetch(API_URL.format(room_id=room_id, page=page)))
        contents = data.get("contents")
        count = data.get("count")
        if not isinstance(contents, list) or not isinstance(count, int) or count < 1:
            raise ValueError("Invalid or empty source response")
        if total is None:
            total = count
        elif total != count:
            raise ValueError("Room changed during pagination; retry synchronization")
        if not contents:
            raise ValueError("Incomplete source pagination")
        records.extend(contents)
        if len(records) >= total:
            break
    else:
        raise ValueError("Source pagination exceeded safety limit")
    if len(records) != total:
        raise ValueError("Source count does not match pagination")
    articles = {}
    for content in records:
        article = content.get("article")
        if not isinstance(article, dict):
            raise ValueError("Source contains a malformed article")
        # Only the published, visible, unscheduled articles in this public room.
        if article.get("status") != 2 or article.get("isView") is not True or article.get("isSchedule") is True:
            continue
        published = timestamp(content.get("publishAt") or article.get("lastPublishAt"))
        if published > now:
            continue
        article_id = article.get("_id")
        title = article.get("title")
        if not isinstance(article_id, str) or not re.fullmatch(r"[0-9a-f]{24}", article_id) or not isinstance(title, str) or not title.strip():
            raise ValueError("Source contains an invalid article ID or title")
        item = {"id": article_id, "title": html.unescape(title).strip(),
                "date": published.date().isoformat(), "published_at": published.isoformat(timespec="seconds"),
                "url": "https://vocus.cc/article/" + article_id}
        abstract = article.get("abstract")
        if isinstance(abstract, str) and abstract.strip():
            item["abstract"] = html.unescape(abstract).strip()
        if valid_cover(article.get("thumbnailUrl")):
            item["cover"] = article["thumbnailUrl"]
        if article_id in articles and articles[article_id] != item:
            raise ValueError("Source contains conflicting duplicate articles")
        articles[article_id] = item
    return sorted(articles.values(), key=lambda item: item["published_at"], reverse=True)


def validate_snapshot(data, now):
    if data.get("source") != PAGE_URL or not isinstance(data.get("articles"), list):
        raise ValueError("Snapshot must come from the PancreasCare room")
    articles = data["articles"]
    if not articles or data.get("count") != len(articles):
        raise ValueError("Snapshot count is empty or inconsistent")
    seen = set()
    normalized = []
    for item in articles:
        if item.get("status") != 2 or item.get("isView") is not True or item.get("isSchedule") is not False:
            raise ValueError("Snapshot contains an unpublished or scheduled article")
        article_id = item.get("id")
        if not isinstance(article_id, str) or not re.fullmatch(r"[0-9a-f]{24}", article_id) or article_id in seen:
            raise ValueError("Snapshot has invalid or duplicate article IDs")
        seen.add(article_id)
        if not isinstance(item.get("title"), str) or not item["title"].strip() or item.get("url") != "https://vocus.cc/article/" + article_id:
            raise ValueError("Snapshot has an invalid title or article URL")
        published = timestamp(item.get("published_at"))
        if published > now or item.get("date") != published.date().isoformat():
            raise ValueError("Snapshot has a future or inconsistent publication date")
        if "cover" in item and not valid_cover(item["cover"]):
            raise ValueError("Snapshot has an invalid cover URL")
        if "abstract" in item and not isinstance(item["abstract"], str):
            raise ValueError("Snapshot has an invalid abstract")
        clean = {key: item[key] for key in ("id", "title", "abstract", "date", "cover", "url") if key in item}
        clean["published_at"] = published.isoformat(timespec="seconds")
        normalized.append(clean)
    return sorted(normalized, key=lambda item: item["published_at"], reverse=True)


def inline_json(value):
    # Keep literal newlines escaped and prevent closing the HTML script element.
    return json.dumps(value, ensure_ascii=False).replace("<", "\\u003c").replace(">", "\\u003e").replace("&", "\\u0026").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")


def render_html(source, data):
    if len(EMBED.findall(source)) != 1 or len(NOSCRIPT.findall(source)) != 1:
        raise ValueError("Education page must contain exactly one embed and one kbList noscript marker")
    embed = "<script>\n/* __KB_EMBED__ */window.__KB__ = " + inline_json(data["articles"]) + ";\nwindow.__KB_UPDATED_AT__ = " + inline_json(data["updated_at"]) + ";\n</script>"
    result = EMBED.sub(lambda match: embed, source, count=1)
    cards = []
    for item in data["articles"][:6]:
        cards.append('          <a class="kb-card" href="' + html.escape(item["url"], quote=True) + '" target="_blank" rel="noopener noreferrer"><div class="kb-body"><h3 class="kb-t">' + html.escape(item["title"]) + '</h3><span class="kb-go">' + item["date"] + ' · 閱讀全文</span></div></a>')
    cards.append('          <a class="kb-card" href="' + PAGE_URL + '" target="_blank" rel="noopener noreferrer"><div class="kb-body"><h3 class="kb-t">前往護胰大聯盟沙龍，閱讀全部文章</h3><span class="kb-go">護胰大聯盟</span></div></a>')
    fallback = '<noscript>\n        <style>#kbList{display:block}</style>\n        <div class="kb-grid">\n' + "\n".join(cards) + '\n        </div>\n      </noscript>'
    result = NOSCRIPT.sub(lambda match: match.group(1) + fallback, result, count=1)
    meta = re.compile(r'(\x3cp id="kbMeta"[^>]*>).*?(</p>)', re.S)
    if len(meta.findall(result)) != 1:
        raise ValueError("Education page must contain exactly one kbMeta marker")
    updated = timestamp(data["updated_at"]).strftime("%Y-%m-%d %H:%M")
    label = "文章清單更新：" + updated + "（台北時間）・共 " + str(data["count"]) + " 篇"
    return meta.sub(lambda match: match.group(1) + label + match.group(2), result, count=1)


def write_outputs(site_dir, data):
    education = site_dir / "education.html"
    output = site_dir / "assets" / "data-pancreas-kb.json"
    # Validate and render everything before touching either target.
    rendered = render_html(education.read_text(encoding="utf-8"), data)
    payloads = [(output, json.dumps(data, ensure_ascii=False, indent=1) + "\n"), (education, rendered)]
    temporary = []
    try:
        for path, content in payloads:
            with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=path.parent, prefix=".kb-sync-", delete=False) as stream:
                stream.write(content)
                temporary.append((Path(stream.name), path))
            os.chmod(stream.name, path.stat().st_mode & 0o777 if path.exists() else 0o644)
        for temp_path, path in temporary:
            os.replace(temp_path, path)
    finally:
        for temp_path, _ in temporary:
            temp_path.unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site-dir", type=Path, default=Path(__file__).resolve().parent)
    parser.add_argument("--input-json", type=Path, help="Use a previously verified room snapshot instead of the live API")
    args = parser.parse_args()
    now = dt.datetime.now(TAIPEI)
    try:
        if args.input_json:
            articles = validate_snapshot(json.loads(args.input_json.read_text(encoding="utf-8")), now)
        else:
            articles = fetch_articles(get_room_id(), now)
        if not articles:
            raise ValueError("No public articles found; existing site left unchanged")
        data = {"source": PAGE_URL, "updated_at": now.isoformat(timespec="seconds"), "count": len(articles), "articles": articles}
        write_outputs(args.site_dir.resolve(), data)
    except (OSError, ValueError, TypeError, KeyError) as error:
        parser.exit(1, "Synchronization failed: " + str(error) + "\n")
    print("Updated " + str(args.site_dir) + ": " + str(len(articles)) + " public articles (" + data["updated_at"] + ")")


if __name__ == "__main__":
    main()
