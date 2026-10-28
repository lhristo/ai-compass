const fs=require('node:fs'),assert=require('node:assert/strict');
const d=JSON.parse(fs.readFileSync('catalog.json','utf8'));
const original=JSON.parse(fs.readFileSync('tests/fixtures/catalog-2026-10-19.json','utf8'));
const counts={assistants:5,research:5,writing:5,images:6,video:5,audio:5,coding:9,productivity:6,agents:16};
assert.equal(d.tools.length,62);assert.equal(d.categories.length,9);
assert.deepEqual(d.categories,original.categories);
for(const t of original.tools)assert.deepEqual(d.tools.find(n=>n.id===t.id),t,`preserve ${t.id}`);
const normalize=url=>{const u=new URL(url);return u.hostname.replace(/^www\./,'')+u.pathname.replace(/\/$/,'');};
assert.equal(new Set(d.tools.map(t=>t.id)).size,62);
assert.equal(new Set(d.tools.map(t=>t.name.toLowerCase())).size,62);
assert.equal(new Set(d.tools.map(t=>normalize(t.url))).size,62);
for(const [category,count]of Object.entries(counts))assert.equal(d.tools.filter(t=>t.category===category).length,count,category);
for(const t of d.tools){for(const k of ['id','name','description','bestFor','consider','keywords','category','reviewed'])assert.equal(typeof t[k],'string');assert(Object.values(t).every(v=>v.length));assert.equal(new URL(t.url).protocol,'https:');assert(counts[t.category]);}
for(const id of ['claude-code','openai-codex','dify','napkin-ai','fathom'])assert.equal(d.tools.find(t=>t.id===id).reviewed,'2026-10-26');
const html=fs.readFileSync('index.html','utf8');assert(html.includes('Explore 62 tools'));assert(html.includes('<b>62</b> curated tools'));assert(html.includes('Explore 62 AI tools'));assert(html.includes('28 Oct 2026'));assert(fs.readFileSync('README.md','utf8').includes('62 AI products'));
console.log('PASS: 62 tools, 9 category counts, unique identities/HTTPS URLs, required fields, review dates, UI counts; all 52 original entries unchanged');
