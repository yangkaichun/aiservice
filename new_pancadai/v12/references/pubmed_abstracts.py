import urllib.request, urllib.parse, time

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0 (research)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")

# JGH 2021 review search
q = urllib.parse.quote('"J Gastroenterol Hepatol"[jour] AND ("artificial intelligence" OR AI) AND pancreatic AND (2020:2022[dp])')
s = get(f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term={q}&retmode=json&retmax=10")
import json
ids = json.loads(s)["esearchresult"]["idlist"]
print("JGH candidates:", ids)

pmids = ["33328124","33328111","36098642","34241550","36650440"] + ids[:4]
pmids = list(dict.fromkeys(pmids))
for pid in pmids:
    try:
        txt = get(f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id={pid}&rettype=abstract&retmode=text")
        print("="*100)
        print(f"### PMID {pid}")
        print(txt[:2600])
        time.sleep(0.4)
    except Exception as e:
        print("ERR", pid, e)
