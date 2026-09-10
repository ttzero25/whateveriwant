import {renderRobotics} from './robotics.js';
import {renderHomeUpdates} from './home-updates.js';
import {renderResearch} from './research.js';
import {diagram} from './diagrams.js';
const main=document.querySelector('#main'),sidebar=document.querySelector('#sidebar'),menu=document.querySelector('#menu-toggle');
const E=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let documents=[],filter='전체',query='',lang='ko';
try{lang=localStorage.getItem('whateveriwant-language')==='en'?'en':'ko';}catch{}
const t=(ko,en)=>lang==='en'?en:ko;
let aiExpanded=true;
try{aiExpanded=localStorage.getItem('whateveriwant-ai-expanded')!=='false';}catch{}
function updateAIExpansion(){
 const button=document.querySelector('#ai-expand');
 document.querySelector('#ai-subnav').hidden=!aiExpanded;
 button.setAttribute('aria-expanded',String(aiExpanded));
 const label=aiExpanded?t('AI 하위 메뉴 접기','Collapse AI subtopics'):t('AI 하위 메뉴 펼치기','Expand AI subtopics');
 button.setAttribute('aria-label',label);button.title=label;
}
document.querySelector('#ai-expand').addEventListener('click',()=>{
 aiExpanded=!aiExpanded;
 try{localStorage.setItem('whateveriwant-ai-expanded',String(aiExpanded));}catch{}
 updateAIExpansion();
});
updateAIExpansion();
const levelNames={'전체':'All','기초':'Foundations','핵심':'Core','응용':'Applied','참고':'Reference','가이드':'Guide'};
const trackLabels={ai:['전체 AI','All AI'],ml:['머신러닝 · ML','Machine Learning'],dl:['딥러닝 · DL','Deep Learning'],llm:['언어 모델 · LLM','Language Models']};
const currentTrack=()=>['#/ml','#/dl','#/llm'].includes(location.hash)?location.hash.slice(2):'ai';
const trackName=track=>track==='security'?'Security':trackLabels[track||'ai'][lang==='en'?1:0];
const count=track=>documents.filter(d=>d.topic==='ai'&&(track==='ai'||d.track===track)).length;
const level=value=>lang==='en'?levelNames[value]:value;
const topics={vulnerabilities:{name:'Vulnerabilities',icon:'⬡'},network:{name:'Network',icon:'⇄'},os:{name:'Operating Systems',icon:'▤'},cs:{name:'Computer Science',icon:'⌘'},ai:{name:'Artificial Intelligence',icon:'✳'},security:{name:'Security',icon:'◇'},'ai-for-security':{name:'AI for Security',icon:'⛨'}};
const topicName=topic=>topic==='vulnerabilities'?t('대표 취약점','Vulnerabilities'):topics[topic]?.name||topic;
const topicCount=topic=>documents.filter(d=>d.topic===topic).length;
const docURL=doc=>'#/'+doc.topic+'/'+doc.slug;
const activeTopic=()=>{const part=location.hash.split('/')[1];return topics[part]?part:['ml','dl','llm'].includes(part)?'ai':null;};
const view=doc=>lang==='en'?{...doc,...doc.en}:doc;
function closeMenu(){sidebar.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',t('메뉴 열기','Open menu'));}
menu.addEventListener('click',()=>{const open=sidebar.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?t('메뉴 닫기','Close menu'):t('메뉴 열기','Open menu'));});
document.addEventListener('click',event=>{if(!sidebar.contains(event.target)&&!menu.contains(event.target))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();if((event.ctrlKey||event.metaKey)&&event.key==='k'){const input=document.querySelector('#search');if(input){event.preventDefault();input.focus();}}});
function localizeShell(){
 document.documentElement.lang=lang;
 updateAIExpansion();
 document.querySelector('.research-link').innerHTML='<span>◉</span> '+t('AI Research Watch','AI Research Watch');
 document.querySelector('.vulnerabilities-link').innerHTML=`<span>⬡</span> ${topicName('vulnerabilities')} <span class="nav-count">${topicCount('vulnerabilities')}</span>`;
 window.updateThemeControl?.();
 document.querySelector('.brand').setAttribute('aria-label',t('홈','Home'));
 document.querySelector('.home-link').innerHTML=`<span>▦</span> ${'Home'} <span class="nav-count">${documents.length}</span>`;
 document.querySelector('.ai-link .nav-count').textContent=count('ai');
 for(const topic of Object.keys(topics))document.querySelector('.'+topic+'-link .nav-count').textContent=topicCount(topic);
 document.querySelector('#ai-subnav').innerHTML=['ml','dl','llm'].map(track=>`<a href="#/${track}" class="${currentTrack()===track?'selected':''}">${trackName(track)}<small>${count(track)}</small></a>`).join('');
 document.querySelectorAll('.upcoming small').forEach(el=>el.textContent=t('준비 중','Coming soon'));
 document.querySelector('.sidebar-bottom small').textContent=t('배운 것을, 나의 언어로.','Learn. Connect. Remember.');
 document.querySelector('footer').innerHTML=`whateveriwant <span>${t('하나씩 배우고, 연결하고, 쌓아가기.','One concept at a time.')}</span><span>${t('공식 자료 기반 · 한국어 해설','Official references · learning notes')}</span>`;
 document.querySelectorAll('[data-language]').forEach(button=>{const active=button.dataset.language===lang;button.setAttribute('aria-pressed',String(active));button.classList.toggle('active',active);});
}
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>{if(!documents.length)return;lang=button.dataset.language;try{localStorage.setItem('whateveriwant-language',lang);}catch{}route();}));
function card(original){const doc=view(original);return `<a class="doc-card" href="${docURL(doc)}"><div class="doc-top"><span class="doc-icon">▧</span> ${doc.topic!=='ai'?topicName(doc.topic):doc.track==='ai'?'Artificial Intelligence':trackName(doc.track)} <span class="level">${level(doc.level)}</span></div><h3>${E(doc.title)}</h3><p>${E(doc.summary)}</p><div class="doc-meta"><span>${lang==='en'?(original.en.type==='korean'?'Korean article':original.en.type==='excerpt'?'Original source excerpt':original.en.type==='navigation'?'Site guide':'Google · original excerpt'):`${doc.minutes}분 읽기 · ${doc.date.replaceAll('-','. ')}`}</span><span>${doc.slug==='index'?t('학습 가이드','Guide'):doc.slug==='glossary'?t('용어집','Glossary'):'TL;DR ↗'}</span></div></a>`;}
function showResults(){const grid=document.querySelector('#documents');if(!grid)return;const term=query.toLocaleLowerCase().trim();const home=!activeTopic();const results=document.querySelector('#home-search-results');if(results)results.hidden=!term;if(home&&!term){grid.innerHTML='';return;}const matches=documents.filter(doc=>(!activeTopic()||doc.topic===activeTopic())&&(currentTrack()==='ai'||doc.track===currentTrack())&&(filter==='전체'||doc.level===filter)&&(!term||[doc.source,doc.title,doc.en.source,doc.en.title].join(' ').toLocaleLowerCase().includes(term)));grid.innerHTML=matches.length?matches.map(card).join(''):`<div class="empty">${t('검색 결과가 없어요. 다른 용어나 필터로 찾아보세요.','No results. Try another term or filter.')}</div>`;document.querySelector('#result-count').textContent=t(`${matches.length}개의 문서`,`${matches.length} documents`);document.querySelectorAll('[data-filter]').forEach(button=>{const active=button.dataset.filter===filter;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});}
function library(){
 document.title='whateveriwant — '+t('나만의 지식백과','Personal knowledge base');document.querySelector('#breadcrumb').textContent=currentTrack()!=='ai'?trackName(currentTrack()):activeTopic()?topicName(activeTopic()):'Home';
 main.innerHTML=`<section class="intro"><div class="eyebrow">A SPACE FOR CURIOUS MINDS</div><div class="intro-row"><div><h1>whateveriwant</h1></div><span class="intro-date">${t('AI · CS · OS · Network · Security','AI · CS · OS · NETWORK · SECURITY')}</span></div></section><div class="search-wrap"><span class="search-icon" aria-hidden="true">⌕</span><input type="search" id="search" aria-label="${t('개념과 용어 검색','Search concepts and terms')}" placeholder="${t('어떤 개념이 궁금한가요?  TLS, 인증, Transformer, RAG…','Search concepts in Korean or English…')}" value="${E(query)}"><kbd>⌘ K</kbd></div>${activeTopic()==='vulnerabilities'?`<section class="vulnerability-intro"><div><div class="eyebrow">VULNERABILITY STUDIES</div><h2>${t('취약점의 원인부터 수정까지','From root cause to prevention')}</h2><p>${t('웹·API·시스템의 대표 주제 14개를 사례와 방어 관점으로 학습합니다.','Explore 14 common web, API and system weaknesses through examples and defenses.')}</p></div><a class="updates-all" href="#/vulnerabilities/index">${t('학습 가이드','Learning guide')} →</a></section>`:''}${!activeTopic()?`<section id="home-updates" class="home-updates" aria-label="${t('최신 이슈','Latest updates')}"></section><section id="home-search-results" hidden><div class="section-head"><h2>${t('관련 개념 검색','Search concepts')}</h2></div>`:''}<nav ${activeTopic()!=='ai'?'hidden':''} class="track-tabs" aria-label="${t('AI 세부 분야','AI subtopics')}">${Object.keys(trackLabels).map(track=>`<a href="#/${track}" class="${currentTrack()===track?'active':''}" ${currentTrack()===track?'aria-current="page"':''}>${trackName(track)} <small>${count(track)}</small></a>`).join('')}</nav><div class="filters" role="group" aria-label="${t('문서 수준 필터','Filter by level')}">${Object.keys(levelNames).map(l=>`<button class="chip" data-filter="${l}" aria-pressed="false">${level(l)}</button>`).join('')}<span class="result-count" id="result-count" aria-live="polite"></span></div><div id="documents" class="document-grid"></div>${!activeTopic()?'</section>':''}`;
 document.querySelector('#search').addEventListener('input',event=>{query=event.target.value;showResults();});document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;showResults();}));showResults();
 if(!activeTopic())renderHomeUpdates(document.querySelector('#home-updates'),lang,documents);
}
function article(topic,slug){
 const original=documents.find(d=>d.topic===topic&&d.slug===slug);if(!original){main.innerHTML=`<div class="empty"><h1>${t('문서를 찾을 수 없어요.','Document not found.')}</h1><a href="#/">${t('라이브러리로 돌아가기','Back to library')} →</a></div>`;document.title=t('문서 없음','Not found')+' — whateveriwant';document.querySelector('#breadcrumb').textContent=t('문서 없음','Not found');return;}
 const doc=view(original);document.title=doc.title+' — whateveriwant';document.querySelector('#breadcrumb').textContent=topicName(topic)+' / '+doc.title;
 const siblings=documents.filter(d=>d.topic===topic),i=siblings.indexOf(original),previous=siblings[i-1],next=siblings[i+1];
 const figure=topic==='ai'?diagram(slug,lang):['cs','os','network','vulnerabilities'].includes(topic)?diagram(topic+'-'+slug,lang):'';
 const notice=lang==='en'&&doc.type==='excerpt'?'<div class="source-notice"><strong>Original English · short excerpt</strong><p>A brief quotation from the official reference, with a link to the complete text.</p></div>':lang==='en'&&doc.type==='original'?`<div class="source-notice"><strong>Original English · selected excerpts</strong><p>Google’s original wording, not a translation of the Korean article. The excerpts cover related concepts; source figures and later paragraphs are available through the original links.</p></div>`:lang==='en'&&doc.type==='korean'?'<div class="source-notice"><strong>Korean article</strong><p>This article is currently available in Korean. It is an AI-authored explanation based on official references, pending owner review; it is not an original English excerpt.</p></div>':'';
 let body=doc.html;
 // Keep TL;DR first, then place the explanatory diagram before the source sections.
 if(figure)body=body.replace('</blockquote>','</blockquote>'+figure);
 const meta=lang==='en'?(doc.type==='korean'?'AI-authored Korean explanation · pending owner review':doc.type==='navigation'?'Site navigation · authored for whateveriwant':doc.type==='excerpt'?'Official reference · short original excerpt':'Google · CC BY 4.0 · original excerpts'):'AI 작성 해설 · 소유자 검토 전';
 main.innerHTML=`<a href="#/${topic!=='ai'?topic:original.track}" class="back-link">← ${topic!=='ai'?topicName(topic):trackName(original.track)}</a><div class="reading-layout"><div><header class="article-header"><div class="eyebrow">${topic!=='ai'?topicName(topic).toUpperCase():original.track==='ai'?'ARTIFICIAL INTELLIGENCE':trackName(original.track)} / ${level(doc.level)}</div><h1>${E(doc.title)}</h1><div class="article-meta">${lang==='ko'?`<span>${doc.minutes}분 읽기</span>`:''}<span>${t('출처 확인','Source checked')} ${doc.date}</span><span>${meta}</span></div></header>${notice}<article class="article" lang="${doc.type==='korean'?'ko':lang}">${body}</article><nav class="article-next" aria-label="${t('이전 및 다음 문서','Previous and next articles')}">${previous?`<a href="${docURL(previous)}"><small>← ${t('이전 문서','Previous')}</small>${E(view(previous).title)}</a>`:'<span></span>'}${next?`<a href="${docURL(next)}"><small>${t('다음 문서','Next')} →</small>${E(view(next).title)}</a>`:''}</nav></div><aside class="toc"><strong>ON THIS PAGE</strong>${doc.headings.map(h=>`<a href="#${h.id}" data-section="${h.id}">${E(h.title)}</a>`).join('')}<a class="source-link" href="https://github.com/ttzero25/whateveriwant/blob/main/${lang==='en'&&['cs','os'].includes(topic)&&doc.type==='excerpt'?'sources/'+topic+'.json':'content/'+(lang==='en'&&topic==='ai'&&doc.type==='original'?'en/originals.json':topic+'/'+doc.slug+'.md')}" target="_blank" rel="noopener noreferrer">${t('GitHub에서 문서 보기','View on GitHub')} ↗</a></aside></div>`;
 document.querySelectorAll('[data-section]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();document.getElementById(link.dataset.section)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));
}
function route(){localizeShell();closeMenu();const hash=location.hash||'#/',[,topic,slug]=hash.split('/');document.querySelector('.home-link').classList.toggle('active',hash==='#/');document.querySelector('.ai-link').classList.toggle('active',activeTopic()==='ai');for(const topicKey of ['security','ai-for-security','cs','os','network','vulnerabilities'])document.querySelector('.'+topicKey+'-link').classList.toggle('active',topic===topicKey);document.querySelector('.research-link').classList.toggle('active',topic==='research');document.querySelector('.robotics-link').classList.toggle('active',topic==='robotics-security');if(topic==='robotics-security'&&!slug)renderRobotics(main,lang);else if(topic==='research'&&!slug)renderResearch(main,lang);else if(slug)article(topic,slug);else library();window.scrollTo(0,0);}
fetch('./documents.json').then(r=>{if(!r.ok)throw Error('Load failed');return r.json();}).then(data=>{documents=data;route();window.addEventListener('hashchange',route);}).catch(()=>{main.innerHTML=`<div class="empty"><h1>${t('문서를 불러오지 못했어요.','Unable to load documents.')}</h1><button id="retry">${t('다시 시도','Retry')}</button></div>`;document.querySelector('#retry').addEventListener('click',()=>location.reload());});
