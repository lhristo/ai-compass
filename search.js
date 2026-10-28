'use strict';
// Transparent local task matching, not an external AI inference service.
const taskRules = [
 ['Diagrams', /diagram|flowchart|infographic|mind.?map|диаграм|схема/iu, ['napkin-ai'], 'Turn text into an explanatory diagram or visual.'],
 ['Meeting notes', /meeting|minutes|transcrib|transcript|recording.*notes|срещ|транскриб/iu, ['otter-ai','fireflies-ai','descript','fathom'], 'Turn spoken conversations into transcripts or notes.'],
 ['Translation', /translat|another language|different language|прев[ое]д/iu, ['deepl-translator','heygen'], 'Translate text or adapt spoken video to another language.'],
 ['Email writing', /email|e-mail|пиш.*писм|имейл/iu, ['grammarly','quillbot','chatgpt','claude'], 'Draft or improve the wording of an email.'],
 ['Website building', /website|web site|landing page|web app|сайт/iu, ['lovable','replit','v0'], 'Turn a description into a website or app prototype.'],
 ['Coding help', /debug|coding|code|programming|bug|програми|код/iu, ['cursor','github-copilot','replit','claude-code','openai-codex','devin','jules'], 'Write, understand or troubleshoot software.'],
 ['Image creation', /image|picture|photo|logo|illustrat|poster|сним|изображ|лого/iu, ['ideogram','recraft','leonardo-ai','midjourney','adobe-firefly'], 'Create visual concepts, illustrations or design assets.'],
 ['Video creation', /video|film|animation|animate|видео|анимац/iu, ['runway','pika','luma-dream-machine','heygen','synthesia'], 'Create or transform video from a creative brief.'],
 ['Music creation', /music|song|soundtrack|compose|музик|песен/iu, ['suno','aiva'], 'Develop a song or instrumental music idea.'],
 ['Voice and narration', /voiceover|narrat|text.to.speech|read.*aloud|озвуч|глас/iu, ['elevenlabs','descript'], 'Create narration or work with recorded speech.'],
 ['Research', /research|academic|papers|sources|scientific|проуч|науч/iu, ['perplexity','elicit','consensus','scite'], 'Find information and inspect supporting sources.'],
 ['Document understanding', /pdf|summari[sz]|document|резюм|документ/iu, ['gemini-notebook--notebooklm','claude'], 'Explore documents and develop summaries grounded in your material.'],
 ['Presentations', /presentation|slides|pitch deck|презентац/iu, ['gamma','genspark'], 'Turn an outline or research into a presentation draft.'],
 ['Customer support', /customer|support.*(bot|agent)|chatbot|helpdesk|клиент/iu, ['botpress','voiceflow','fin','salesforce-agentforce'], 'Build a conversational assistant for customer questions.'],
 ['Workflow automation', /automat|repetitive|workflow|автомат/iu, ['n8n','make-ai-agents','gumloop','relevance-ai','lindy','dify','microsoft-copilot-studio'], 'Connect apps and automate a repeatable workflow.'],
 ['Multi-step agents', /agent|delegate|агент/iu, ['manus','lindy','relevance-ai','genspark'], 'Delegate a task spanning several steps or connected tools.'],
 ['Writing improvement', /grammar|rewrite|proofread|essay|blog|грамат|редакт/iu, ['grammarly','quillbot','deepl-write','jasper'], 'Improve a draft or develop written content.']
];
const searchStop = new Set('i me my we our you your want need would like to a an the for with and or of help create make build something can please is it that this be have do using use ai tool tools free paid best get could some from into how will able да и за на ми аз искам трябва може помощ'.split(' '));
function taskMatch(tool,query,categories){
 const q=query.toLowerCase().trim();if(!q)return {score:1,reasons:[]};
 const tokens=[...new Set((q.match(/[\p{L}\p{N}]+/gu)||[]).filter(w=>!searchStop.has(w)))];
 const words=s=>(s.toLowerCase().match(/[\p{L}\p{N}]+/gu)||[]);
 const name=tool.name.toLowerCase(), body=words([tool.description,tool.bestFor,tool.keywords].join(' '));
 const cat=words(categories.find(c=>c.id===tool.category).keywords);
 let score=0;const reasons=[];
 if(q===name)score+=100;
 for(const term of tokens){const match=w=>w===term||(term.length>=4&&w.startsWith(term));if(words(name).some(match))score+=20;else if(body.some(match))score+=3;else if(cat.some(match))score+=1;}
 for(const [label,pattern,ids,reason] of taskRules){if(pattern.test(q)&&ids.includes(tool.id)){score+=18;reasons.push(reason);}}
 if(!reasons.length&&score)reasons.push('Matches terms in your request. '+tool.bestFor);
 return {score,reasons};
}
