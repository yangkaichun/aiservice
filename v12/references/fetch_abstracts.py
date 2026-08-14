import urllib.request, time, json

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0 (research)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")

pmids = ["33328124","36098642","34241550","36650440","33624891"]
out = []
for pid in pmids:
    txt = get(f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id={pid}&rettype=abstract&retmode=text")
    out.append(f"===== PMID {pid} =====\n{txt}")
    time.sleep(0.4)
open("/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/papers_abstracts_pubmed.txt","w").write("\n\n".join(out))
print("saved", sum(len(x) for x in out), "chars")
# print lengths
for pid in pmids:
    i = pmids.index(pid)
    print(pid, len(out[i]))
