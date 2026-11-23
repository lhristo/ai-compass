const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const d=JSON.parse(fs.readFileSync('catalog.json','utf8')),ctx=vm.createContext({});vm.runInContext(fs.readFileSync('search.js','utf8'),ctx);
for(const [q,ids]of [
 ['I need to turn meeting recordings into notes',['otter-ai','fireflies-ai','descript']],
 ['I want a website for my bakery but cannot program',['lovable','replit','v0']],
 ['Искам да направя презентация за училище',['gamma','genspark']],
 ['Please help me translate a letter to another language',['deepl-translator']],
 ['I need an agent to answer customer questions',['botpress','voiceflow']],
 ['Summarize a long PDF document for me',['gemini-notebook--notebooklm','claude']],
 ['I want to compose a song for a birthday',['suno','aiva']]]){
 const top=d.tools.map(t=>({id:t.id,...ctx.taskMatch(t,q,d.categories)})).sort((a,b)=>b.score-a.score).slice(0,3);
 assert(ids.some(id=>top.some(t=>t.id===id)),q+' -> '+JSON.stringify(top));assert(top.every(t=>t.reasons.length));
}
assert(d.tools.every(t=>ctx.taskMatch(t,'zxqwunknown',d.categories).score===0));
for(const r of vm.runInContext('taskRules',ctx))for(const id of r[2])assert(d.tools.some(t=>t.id===id),id);
console.log('PASS: 7 natural-language ranking cases, English/Bulgarian, unknown query and rule destinations');

for(const [q,id]of [
 ['Claude Code','claude-code'],['OpenAI Codex','openai-codex'],['Dify','dify'],['Napkin AI','napkin-ai'],['Fathom','fathom'],
 ['turn text into a flowchart','napkin-ai'],['Искам диаграма от текст','napkin-ai'],['fathom.video','fathom']]){
 const ranked=d.tools.map(t=>({id:t.id,...ctx.taskMatch(t,q,d.categories)})).sort((a,b)=>b.score-a.score);
 assert.equal(ranked[0].id,id,q);assert(ranked[0].reasons.length);
}
for(const [q,id]of [['помощ с код','claude-code'],['помощ с код','openai-codex'],['автоматизация','dify'],['бележки от среща','fathom']]){
 const match=ctx.taskMatch(d.tools.find(t=>t.id===id),q,d.categories);assert(match.score>=18,q+' '+id);assert(match.reasons.length);
}
console.log('PASS: 8 new product/alias/task rankings and 4 Bulgarian relevance checks');

for(const id of ['devin','jules','microsoft-copilot-studio','salesforce-agentforce','fin']){
 const tool=d.tools.find(t=>t.id===id);
 const ranked=d.tools.map(t=>({id:t.id,...ctx.taskMatch(t,tool.name,d.categories)})).sort((a,b)=>b.score-a.score);
 assert.equal(ranked[0].id,id,tool.name);
}
console.log('PASS: all five October 28 additions rank first by name');

for(const [q,id]of [['Aider','aider'],['aider.chat','aider'],['Flowise','flowise'],['flowiseai','flowise']]){
 const ranked=d.tools.map(t=>({id:t.id,...ctx.taskMatch(t,q,d.categories)})).sort((a,b)=>b.score-a.score);
 assert.equal(ranked[0].id,id,q);assert(ranked[0].reasons.length);
}
for(const [q,id]of [['help debugging code','aider'],['помощ с код','aider'],['build an automation workflow','flowise'],['автоматизация','flowise']]){
 const match=ctx.taskMatch(d.tools.find(t=>t.id===id),q,d.categories);assert(match.score>=18,q);assert(match.reasons.length);
}
console.log('PASS: November additions, identity/alias rankings and English/Bulgarian task relevance');

for(const [q,id]of [['LM Studio Bionic','lm-studio-bionic'],['Bionic','lm-studio-bionic'],['lmstudio','lm-studio-bionic'],['Ollama','ollama']]){
 const ranked=d.tools.map(t=>({id:t.id,...ctx.taskMatch(t,q,d.categories)})).sort((a,b)=>b.score-a.score);
 assert.equal(ranked[0].id,id,q);assert(ranked[0].reasons.length);
}
for(const q of ['run local models','локални модели']){
 const ranked=d.tools.map(t=>({id:t.id,...ctx.taskMatch(t,q,d.categories)})).sort((a,b)=>b.score-a.score).slice(0,3);
 for(const id of ['ollama','lm-studio-bionic'])assert(ranked.some(t=>t.id===id&&t.score>=18&&t.reasons.length),q+' '+id);
}
console.log('PASS: November 9 names/aliases and English/Bulgarian local-model ranking');

for(const q of ['NaturalReader','Natural Reader','naturalreaders','read documents aloud','четене на глас','слушане на документи']){
 const ranked=d.tools.map(t=>({id:t.id,...ctx.taskMatch(t,q,d.categories)})).sort((a,b)=>b.score-a.score);
 assert.equal(ranked[0].id,'naturalreader',q);assert(ranked[0].reasons.length);
}
console.log('PASS: NaturalReader names, alias and English/Bulgarian listening tasks rank first');

for(const q of ['ResearchRabbit','Research Rabbit','researchrabbit.ai','map related papers','literature review','литературен обзор','карта на научни публикации']){
 const ranked=d.tools.map(t=>({id:t.id,...ctx.taskMatch(t,q,d.categories)})).sort((a,b)=>b.score-a.score);
 assert.equal(ranked[0].id,'researchrabbit',q);assert(ranked[0].reasons.length);
}
console.log('PASS: ResearchRabbit names, aliases and EN/BG literature mapping rank first');

for(const id of ['crewai','langgraph','bardeen','copy-ai','sierra','decagon','browser-use','glean-agents','cline','openhands']){
 const t=d.tools.find(t=>t.id===id);
 const ranked=d.tools.map(t=>({id:t.id,...ctx.taskMatch(t,d.tools.find(n=>n.id===id).name,d.categories)})).sort((a,b)=>b.score-a.score);
 assert.equal(ranked[0].id,id,t.name);
}
console.log('PASS: all 10 manual additions rank first by name');
