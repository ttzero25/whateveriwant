import {loadResearch} from './research.js';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rules=[
 [/prompt injection|jailbreak|adversarial/i,['ai-for-security/securing-ai-systems','security/principles']],
 [/phishing|spam/i,['ai-for-security/phishing-classification','ai-for-security/detection-evaluation']],
 [/hate speech|cross.script/i,['ai-for-security/security-data','ai-for-security/detection-evaluation']],
 [/code|coding|\bides?\b|next edit|software|vulnerabilit/i,['security/secure-development','security/software-supply-chain']],
 [/agent|tool.use/i,['ai/llm-evaluation-tools','ai-for-security/llm-security-operations']],
 [/privacy|membership|unlearning|leak/i,['ai-for-security/security-data','security/cryptography']],
 [/benchmark|evaluat|detect|measur/i,['ai-for-security/detection-evaluation','ai/evaluation']],
 [/align|safety|harm/i,['ai-for-security/securing-ai-systems','ai/evaluation']],
 [/retrieval|\brag\b/i,['ai/rag','ai-for-security/llm-security-operations']]
];
export function relatedConcepts(item,documents){
 const defaults=item.tags.includes('security')?['ai-for-security/securing-ai-systems','security/principles']:item.tags.includes('evaluation')?['ai/evaluation','ai-for-security/detection-evaluation']:item.tags.includes('safety')?['ai-for-security/securing-ai-systems','ai/evaluation']:['ai/fundamentals','ai/model-selection-features'];
 const keys=[...(rules.find(([pattern])=>pattern.test(item.title))?.[1]||[]),...defaults];
 return [...new Set(keys)].map(key=>documents.find(d=>`${d.topic}/${d.slug}`===key)).filter(Boolean).slice(0,2);
}
export async function renderHomeUpdates(container,lang,documents){
 const t=(ko,en)=>lang==='en'?en:ko;
 const active=()=>container.isConnected&&document.documentElement.lang===lang;
 container.innerHTML=`<p class="loading" role="status">${t('최신 이슈를 불러오는 중…','Loading latest updates…')}</p>`;
 try{
  const data=await loadResearch();
  if(!active())return;
  const items=data.sources.map(source=>data.items.filter(item=>item.source===source.id).sort((a,b)=>(b.published_at||b.date).localeCompare(a.published_at||a.date)||a.title.localeCompare(b.title))[0]).filter(Boolean);
  container.innerHTML=`<div class="updates-heading"><div><div class="eyebrow">LATEST UPDATES</div><h2>${'AI Research Watch'}</h2><p>${t('OpenAI · Anthropic · arXiv의 최근 소식을 한곳에서 확인하세요.','The latest from OpenAI, Anthropic and arXiv in one place.')}</p></div><a class="updates-all" href="#/research">${t('동향 전체 보기','All updates')} →</a></div><div class="updates-grid">${items.length?items.map(item=>{
   const source=data.sources.find(s=>s.id===item.source);
   const stale=!source?.last_success||Date.now()-Date.parse(source.last_success)>48*3600000||source.status!=='ok';
   return `<article class="update-card"><div class="research-item-meta"><span>${escape(source?.name||item.source)}</span><time datetime="${escape(item.date)}">${escape(item.date)}</time><small>${item.date_kind==='announced'?t('공고','Announced'):t('게시','Published')}</small>${item.kind==='preprint'?'<span class="research-badge">PREPRINT</span>':''}</div><h3><a href="${escape(item.url)}" target="_blank" rel="noopener noreferrer" lang="en">${escape(item.title)} ↗</a></h3>${stale?`<small class="feed-warning">${t('저장된 목록 · 출처 갱신 확인 필요','Saved entry · source update needs attention')}</small>`:''}<div class="update-concepts"><span>${t('함께 읽을 개념','Related concepts')}</span>${relatedConcepts(item,documents).map(doc=>`<a href="#/${doc.topic}/${doc.slug}">${escape(lang==='en'?doc.en.title:doc.title)} <span aria-hidden="true">→</span></a>`).join('')}</div></article>`;
  }).join(''):`<p class="updates-empty">${t('수집된 관련 이슈가 아직 없어요. 동향 페이지에서 다른 주제를 살펴보세요.','No related updates collected yet. Explore other topics on the updates page.')}</p>`}</div><p class="updates-note">${t('출처별 최근 글 1건씩 · 날짜는 출처의 게시·공고 기준 · 관련 개념은 제목·주제 기반 자동 연결','One latest collected entry per source · Source publication or announcement dates · Concept links suggested from titles and topics')}</p>`;
 }catch{
  if(!active())return;
  container.innerHTML=`<div class="updates-heading"><div><h2>${t('최신 이슈를 불러오지 못했어요','Unable to load latest updates')}</h2><p>${t('잠시 후 다시 시도하거나 동향 페이지를 열어보세요.','Try again or visit the updates page.')}</p></div><a href="#/research">${t('동향 전체 보기','All updates')} →</a></div><button class="chip" data-updates-retry>${t('다시 시도','Retry')}</button>`;
  container.querySelector('[data-updates-retry]').addEventListener('click',()=>renderHomeUpdates(container,lang,documents));
 }
}
