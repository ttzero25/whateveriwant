import {renderTLDR,setupConferences} from './research-tldr.js';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={security:['AI 보안','AI security'],safety:['안전성·정렬','Safety & alignment'],evaluation:['평가·신뢰성','Evaluation'],research:['기타 동향','Other updates']};
let loadedAt=0;
let request,source='all',topic='all',days='30',query='';
export function loadResearch(){
 if(Date.now()-loadedAt>300000){request=null;loadedAt=Date.now();}
 request??=fetch('./research.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Load failed');return r.json();}).catch(e=>{request=null;throw e;});
 return request;
}
export async function renderResearch(main,lang){
 const t=(ko,en)=>lang==='en'?en:ko;
 document.title=t('AI Research Watch','AI Research Watch')+' — whateveriwant';
 document.querySelector('#breadcrumb').textContent=t('AI Research Watch','AI Research Watch');
 main.innerHTML=`<p class="loading">${t('연구 동향을 불러오는 중…','Loading research updates…')}</p>`;
 try{
  const data=await loadResearch();
  if(location.hash!=='#/research'||document.documentElement.lang!==lang)return;
  const date=value=>value?new Intl.DateTimeFormat(lang==='en'?'en-GB':'ko-KR',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Seoul'}).format(new Date(value)):t('아직 없음','Not yet');
  main.innerHTML=`<section class="research-intro"><div class="eyebrow">RESEARCH WATCH</div><h1>${t('AI Research Watch','AI Research Watch')}</h1><p>${t('새로운 보안 이슈부터 모델 안전성·평가 연구까지, 공식 출처에서 이어 읽어보세요.','Follow security developments, model safety and evaluation through original sources.')}</p><small>${data.automation_enabled?t('매일 08:17 KST 갱신 예정 · 실행이 지연될 수 있어요.','Scheduled daily at 08:17 KST; runs may be delayed.'):t('자동 갱신 연결 대기 · 마지막으로 수집한 목록입니다.','Automatic updates pending setup; showing the last collected snapshot.')} ${t('마지막 수집 시도','Last collection attempt')}: ${escape(date(data.attempted_at))}</small></section><div class="research-sources">${data.sources.map(s=>{
   const stale=!s.last_success||Date.now()-Date.parse(s.last_success)>48*3600000;
   return `<section class="research-source"><a href="${escape(s.home)}" target="_blank" rel="noopener noreferrer"><strong>${escape(s.name)}</strong><span>↗</span></a><p>${s.id==='arxiv'?t('cs.CR · cs.AI · cs.LG 논문 알림','cs.CR · cs.AI · cs.LG announcements'):s.id==='openai'?t('공식 뉴스·제품 발표·연구','Official news, releases & research'):t('공식 Newsroom + Research','Official Newsroom + Research')}</p><ul class="research-source-latest">${data.items.filter(item=>item.source===s.id).slice(0,3).map(item=>`<li><time datetime="${item.date}">${item.date}</time><a href="${escape(item.url)}" lang="en" target="_blank" rel="noopener noreferrer">${escape(item.title)} ↗</a>${renderTLDR(item,lang)}</li>`).join('')}</ul><small>${t('최근 수집 성공' ,'Last successful collection')}: ${escape(date(s.last_success))}</small>${s.status!=='ok'||stale?`<p class="feed-warning">${t('갱신 확인 필요 · 저장된 목록을 표시합니다.','Update needs attention; showing saved entries.')}</p>`:''}</section>`;
  }).join('')}</div><section id="conference-watch" class="conference-watch"></section><div class="research-controls"><div class="search-wrap"><span class="search-icon" aria-hidden="true">⌕</span><input id="research-search" type="search" aria-label="${t('연구 제목·요약 검색','Search research titles and summaries')}" placeholder="${t('제목·요약 검색: prompt injection, alignment, benchmark…','Search titles and summaries: prompt injection, alignment, benchmark…')}" value="${escape(query)}"></div><div class="research-filter-row"><div role="group" aria-label="${t('출처 필터','Source filter')}" class="research-pills">${[['all',t('전체 출처','All sources')],...data.sources.map(s=>[s.id,s.name])].map(([id,name])=>`<button class="chip" data-source="${id}">${name}</button>`).join('')}</div><label class="research-period">${t('기간','Period')} <select id="research-period">${[['7',t('최근 7일','Last 7 days')],['30',t('최근 30일','Last 30 days')],['90',t('최근 90일','Last 90 days')],['all',t('저장된 전체','All saved')]].map(([value,label])=>`<option value="${value}" ${value===days?'selected':''}>${label}</option>`).join('')}</select></label></div><div role="group" aria-label="${t('주제 필터','Topic filter')}" class="research-pills">${[['all',t('전체 동향','All updates')],...Object.entries(labels).map(([id,label])=>[id,label[lang==='en'?1:0]])].map(([id,label])=>`<button class="chip" data-topic="${id}">${label}</button>`).join('')}</div></div><p class="research-note">${t('한국어 TL;DR은 소개문·초록 기반 AI 요약이며, 영어는 짧은 원문 발췌입니다. 원문 제목을 그대로 표시하며 주제는 키워드로 자동 분류합니다. 보안 탭은 관련 연구·발표를 모은 것으로 실제 사고 목록이나 중요도 순위가 아닙니다. arXiv는 프리프린트이며 동료 심사를 보장하지 않습니다.','Korean TL;DRs are AI-written summaries of descriptions or abstracts; English displays short original excerpts. Original titles are shown unchanged. Topics are keyword-based suggestions; the security view is not an incident register or importance ranking. arXiv preprints are not guaranteed to be peer-reviewed.')}</p><div class="section-head"><h2>${t('최신순으로 보기','Newest first')}</h2><span id="research-count" aria-live="polite"></span></div><div id="research-results" class="research-results"></div><p class="research-note">${t('출처별 최근 수집분을 보관합니다. 수집 범위 밖의 글은 위 공식 사이트에서 확인하세요.','This collection retains recent fetched entries. Visit the official sites for publications outside its coverage.')}</p>`;
  setupConferences(main.querySelector('#conference-watch'),data.conferences,lang);
  let visible=24;
  function update(reset=true){
   if(reset)visible=24;
   const cutoff=days==='all'?'0000-00-00':new Date(Date.now()-Number(days)*86400000).toISOString().slice(0,10);
   const matches=data.items.filter(item=>(source==='all'||item.source===source)&&(topic==='all'||item.tags.includes(topic))&&item.date>=cutoff&&[item.title,item.tldr?.ko,item.tldr?.en].filter(Boolean).join(' ').toLowerCase().includes(query.toLowerCase().trim()));
   main.querySelector('#research-count').textContent=t(`${matches.length}개 항목`,`${matches.length} entries`);
   main.querySelector('#research-results').innerHTML=matches.length?matches.slice(0,visible).map(item=>`<article class="research-item"><div class="research-item-meta"><span>${escape(data.sources.find(s=>s.id===item.source)?.name||item.source)}</span><time datetime="${item.date}">${item.date}</time><small>${item.date_kind==='announced'?(item.announcement?.startsWith('replace')?t('수정 공고','Revision announced'):item.announcement==='new'?t('신규 공고','New submission'):t('공고일','Announced')):t('게시일','Published')}</small>${item.kind==='preprint'?'<span class="research-badge">PREPRINT</span>':`<span class="research-badge">${item.channel==='news'?t('뉴스·발표','News'):t('연구','Research')}</span>`}</div><h3><a href="${escape(item.url)}" lang="en" target="_blank" rel="noopener noreferrer">${escape(item.title)} <span aria-hidden="true">↗</span></a></h3>${renderTLDR(item,lang)}<div class="research-tags">${item.tags.map(tag=>`<span>${labels[tag][lang==='en'?1:0]}</span>`).join('')}</div></article>`).join(''):`<div class="empty">${t('이 조건에 맞는 글이 없어요. 기간을 넓히거나 다른 출처·주제를 선택해보세요.','No matching entries. Try a wider period or another source or topic.')}</div>`;
   if(matches.length>visible){
    const more=document.createElement('button');more.className='research-more chip';more.textContent=t(`더 보기 (${matches.length-visible}개 남음)`,`Show more (${matches.length-visible} remaining)`);more.addEventListener('click',()=>{visible+=24;update(false);main.querySelectorAll('.research-item h3 a')[visible-24]?.focus();});main.querySelector('#research-results').append(more);
   }
   for(const [attribute,value] of [['source',source],['topic',topic]])main.querySelectorAll(`[data-${attribute}]`).forEach(button=>{const active=button.dataset[attribute]===value;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  }
  main.querySelector('#research-search').addEventListener('input',e=>{query=e.target.value;update();});
  main.querySelector('#research-period').addEventListener('change',e=>{days=e.target.value;update();});
  main.querySelectorAll('[data-source]').forEach(b=>b.addEventListener('click',()=>{source=b.dataset.source;update();}));
  main.querySelectorAll('[data-topic]').forEach(b=>b.addEventListener('click',()=>{topic=b.dataset.topic;update();}));
  update();
 }catch{
  if(location.hash!=='#/research'||document.documentElement.lang!==lang)return;
  main.innerHTML=`<div class="empty"><p>${t('동향 목록을 불러오지 못했어요.','Unable to load research updates.')}</p><button id="research-retry" class="chip">${t('다시 시도','Retry')}</button></div>`;
  main.querySelector('#research-retry').addEventListener('click',()=>renderResearch(main,lang));
 }
}
