"""Read-only official landing-page checks; blocked requests are not called verified."""
import concurrent.futures,json,urllib.request,urllib.error,re,html
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def check(t):
 result={'id':t['id'],'url':t['url']}
 try:
  req=urllib.request.Request(t['url'],headers={'User-Agent':'Mozilla/5.0 (compatible; AICompassLinkCheck/1.0)'})
  with urllib.request.urlopen(req,timeout=15) as r:
   raw=r.read(350000).decode('utf-8','replace');result.update(status=r.status,final_url=r.url)
   title=re.search(r'<title[^>]*>(.*?)</title>',raw,re.S|re.I)
   result['title']=html.unescape(re.sub('<[^>]+>','',title[1])).strip() if title else ''
   desc=re.search(r'<meta[^>]+name=[\"\']description[\"\'][^>]*content=[\"\']([^\"\']+)',raw,re.I)
   result['description']=html.unescape(desc[1])[:500] if desc else ''
 except Exception as e:result.update(status=getattr(e,'code',None),error=type(e).__name__)
 return result
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:results=list(pool.map(check,json.loads((ROOT/'catalog.json').read_text())['tools']))
 (ROOT/'link-checks.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
 for r in results:print(r['id'],r['status'],r.get('title',r.get('error'))[:120])
