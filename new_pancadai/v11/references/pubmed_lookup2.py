import json, urllib.request, urllib.parse, time

queries = [
    ("Lancet DH 2020", '"Lancet Digit Health"[jour] AND pancreatic AND "deep learning"'),
    ("Radiology 2023 nationwide", 'Radiology[jour] AND "pancreatic cancer" AND "deep learning" AND nationwide'),
    ("Radiol Imaging Cancer 2021", '"Radiol Imaging Cancer"[jour] AND pancreatic AND radiomic'),
    ("BMC Cancer 2023", '"BMC Cancer"[jour] AND pancreatic AND radiomic AND nationwide'),
    ("JGH 2021", '"J Gastroenterol Hepatol"[jour] AND pancreatic AND ("artificial intelligence" OR "deep learning")'),
]

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0 (research)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")

for name, term in queries:
    try:
        q = urllib.parse.quote(term)
        s = json.loads(get(f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term={q}&retmode=json&retmax=8"))
        ids = s["esearchresult"]["idlist"]
        print("="*90)
        print(name, "->", ids)
        if ids:
            summ = json.loads(get(f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id={','.join(ids)}&retmode=json"))
            for pid in ids:
                d = summ["result"].get(pid, {})
                print(f"  PMID {pid}: {d.get('title','')[:160]} | {d.get('source','')} {d.get('pubdate','')} | {d.get('elocationid','')}")
        time.sleep(0.4)
    except Exception as e:
        print("ERR", name, e)
