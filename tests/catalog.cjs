const fs=require('node:fs'),assert=require('node:assert/strict');
const d=JSON.parse(fs.readFileSync('catalog.json','utf8'));
const original=JSON.parse(fs.readFileSync('tests/fixtures/catalog-2026-10-19.json','utf8'));
const counts={assistants:6,research:8,writing:7,images:9,video:8,audio:9,coding:15,productivity:9,agents:27};
assert.equal(d.tools.length,98);assert.equal(d.categories.length,9);
assert.deepEqual(d.categories,original.categories);
for(const t of original.tools)assert.deepEqual(d.tools.find(n=>n.id===t.id),t,`preserve ${t.id}`);
const normalize=url=>{const u=new URL(url);return u.hostname.replace(/^www\./,'')+u.pathname.replace(/\/$/,'');};
assert.equal(new Set(d.tools.map(t=>t.id)).size,98);
assert.equal(new Set(d.tools.map(t=>t.name.toLowerCase())).size,98);
assert.equal(new Set(d.tools.map(t=>normalize(t.url))).size,98);
for(const [category,count]of Object.entries(counts))assert.equal(d.tools.filter(t=>t.category===category).length,count,category);
for(const t of d.tools){for(const k of ['id','name','description','bestFor','consider','keywords','category','reviewed'])assert.equal(typeof t[k],'string');assert(Object.values(t).every(v=>v.length));assert.equal(new URL(t.url).protocol,'https:');assert(counts[t.category]);}
for(const id of ['claude-code','openai-codex','dify','napkin-ai','fathom'])assert.equal(d.tools.find(t=>t.id===id).reviewed,'2026-10-26');
const html=fs.readFileSync('index.html','utf8');assert(html.includes('Explore 98 tools'));assert(html.includes('<b>98</b> curated tools'));assert(html.includes('Explore 98 AI tools'));assert(html.includes('24 Nov 2026'));assert(fs.readFileSync('README.md','utf8').includes('98 AI products'));
console.log('PASS: 98 tools, 9 category counts, unique identities/HTTPS URLs, required fields, review dates, UI counts; all 52 original entries unchanged');

const previous=JSON.parse(fs.readFileSync('tests/fixtures/catalog-2026-10-28.json','utf8'));
assert.equal(previous.tools.length,62);
assert.deepEqual(d.categories,previous.categories);
for(const t of previous.tools)assert.deepEqual(d.tools.find(n=>n.id===t.id),t,`preserve pre-update ${t.id}`);
assert.deepEqual(d.tools.filter(t=>!previous.tools.some(p=>p.id===t.id)&&t.reviewed<='2026-11-23').map(t=>t.id),['aider','flowise','lm-studio-bionic','ollama','naturalreader','researchrabbit','crewai','langgraph','bardeen','copy-ai','sierra','decagon','browser-use','glean-agents','cline','openhands']);
for(const id of ['aider','flowise'])assert.equal(d.tools.find(t=>t.id===id).reviewed,'2026-11-02');
for(const t of d.tools){const u=new URL(t.url);assert.equal(u.search,'');assert.equal(u.username,'');assert.equal(u.password,'');}
assert.equal(d.tools.find(t=>t.id==='aider').category,'coding');
assert.equal(d.tools.find(t=>t.id==='flowise').category,'agents');
assert.match(d.tools.find(t=>t.id==='flowise').description,/platform for building/);
console.log('PASS: all 62 pre-update entries preserved; two dated additions; clean official destinations; platform distinction');

const baseline=JSON.parse(fs.readFileSync('tests/fixtures/catalog-2026-11-09-before.json','utf8'));
assert.equal(baseline.tools.length,64);
assert.deepEqual(d.categories,baseline.categories);
for(const t of baseline.tools)assert.deepEqual(d.tools.find(n=>n.id===t.id),t,`preserve working-tree entry ${t.id}`);
const added=d.tools.filter(t=>!baseline.tools.some(p=>p.id===t.id)&&t.reviewed==='2026-11-09');
assert.deepEqual(added.map(t=>t.id),['lm-studio-bionic','ollama']);
for(const t of added){assert.equal(t.reviewed,'2026-11-09');assert.match(t.id,/^[a-z0-9-]+$/);}
assert.equal(added[0].category,'agents');assert.match(added[0].description,/desktop AI agent/);
assert.equal(added[1].category,'coding');assert.match(added[1].consider,/Not a ready-made autonomous agent/);
for(const aliases of [['lm-studio-bionic','bionic','lmstudio','lm-studio'],['ollama']])assert.equal(d.tools.filter(t=>aliases.includes(t.id)).length,1);
console.log('PASS: all 64 working-tree originals unchanged; two November 9 additions, review dates and identity/type checks');

const beforeNovember16=JSON.parse(fs.readFileSync('tests/fixtures/catalog-2026-11-16-before.json','utf8'));
assert.equal(beforeNovember16.tools.length,66);
for(const t of beforeNovember16.tools)assert.deepEqual(d.tools.find(n=>n.id===t.id),t,`preserve November 16 baseline ${t.id}`);
const weekly=d.tools.filter(t=>!beforeNovember16.tools.some(p=>p.id===t.id)&&t.reviewed==='2026-11-16');
assert.deepEqual(weekly.map(t=>t.id),['naturalreader']);
assert.equal(weekly[0].reviewed,'2026-11-16');assert.equal(weekly[0].category,'audio');
assert.equal(weekly[0].url,'https://www.naturalreaders.com/');
assert.match(weekly[0].consider,/different usage rights/);
assert.equal(d.tools.filter(t=>/natural.?reader/i.test(t.name)).length,1);
console.log('PASS: all 66 working-tree entries unchanged; NaturalReader identity, review date, category and licensing caution');

const beforeNovember23=JSON.parse(fs.readFileSync('tests/fixtures/catalog-2026-11-23-before.json','utf8'));
assert.equal(beforeNovember23.tools.length,67);
for(const t of beforeNovember23.tools)assert.deepEqual(d.tools.find(n=>n.id===t.id),t,`preserve November 23 baseline ${t.id}`);
const latest=d.tools.filter(t=>!beforeNovember23.tools.some(p=>p.id===t.id)&&t.reviewed==='2026-11-23');
assert.deepEqual(latest.map(t=>t.id),['researchrabbit','crewai','langgraph','bardeen','copy-ai','sierra','decagon','browser-use','glean-agents','cline','openhands']);
assert.equal(latest[0].reviewed,'2026-11-23');assert.equal(latest[0].category,'research');
assert.equal(latest[0].url,'https://www.researchrabbit.ai/');
assert.match(latest[0].consider,/not an exhaustive systematic search/);
assert.equal(d.tools.filter(t=>/research.?rabbit/i.test(t.name)).length,1);
console.log('PASS: all 67 inherited entries preserved exactly; ResearchRabbit date, identity, category and research caution');

const manualBefore=require('./fixtures/catalog-2026-11-23-manual-before.json');
for(const t of manualBefore.tools)assert.deepEqual(d.tools.find(n=>n.id===t.id),t);
assert.equal(d.tools.filter(t=>t.reviewed<='2026-11-23').length-manualBefore.tools.length,10);
console.log('PASS: 10 verified additions; all 68 inherited entries preserved');

const beforeNovember24=require('./fixtures/catalog-2026-11-24-before.json');
assert.equal(beforeNovember24.tools.length,78);
assert.deepEqual(d.tools.slice(0,78),beforeNovember24.tools);
assert.deepEqual(d.tools.slice(78).map(t=>t.id),["kagi-assistant", "augment-code", "bolt", "scispace", "scholarcy", "wordtune", "sudowrite", "photoroom", "krea", "canva-ai", "veed", "opusclip", "invideo", "speechify", "adobe-podcast", "soundraw", "granola", "beautiful-ai", "reclaim", "retell-ai"]);
for(const t of d.tools.slice(78))assert.equal(t.reviewed,'2026-11-24');
console.log('PASS: 20 new entries; all 78 previous entries preserved exactly');
