import {renderTLDR} from './research-tldr.js';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={autonomy:['자율주행','Autonomous driving'],vehicle:['차량 보안','Vehicle security'],ros:['ROS·미들웨어','ROS & middleware'],physical:['Physical AI·로봇','Physical AI & robotics'],sensors:['센서·인지','Sensors & perception'],security:['보안 연구','Security research']};
export function unifiedItems(data){
 const news=new Map();
 for(const item of data.items||[]){
  const existing=news.get(item.url);
  if(existing){if(!existing.source_ids.includes(item.source))existing.source_ids.push(item.source);continue;}
  news.set(item.url,{...item,entry_id:'news:'+item.url,entry_kind:'news',year:Number(item.date.slice(0,4)),source_ids:[item.source]});
 }
 const papers=(data.archive?.items||[]).map(item=>({...item,entry_id:'conference:'+item.id,entry_kind:'conference',source_ids:[item.venue],tags:[...new Set([...item.tags,'security'])]}));
 return [...news.values(),...papers].sort((a,b)=>b.year-a.year||(b.published_at||b.date||'').localeCompare(a.published_at||a.date||'')||a.source_ids[0].localeCompare(b.source_ids[0])||a.title.localeCompare(b.title,'en'));
}
export function filterUnified(items,{source='all',year='all',topic='all',kind='all',query=''}={}){
 const term=query.trim().toLowerCase();
 return items.filter(i=>(source==='all'||i.source_ids.includes(source))&&(year==='all'||String(i.year)===String(year))&&(topic==='all'||i.tags.includes(topic))&&(kind==='all'||i.entry_kind===kind)&&[i.title,i.tldr?.ko,i.tldr?.en].filter(Boolean).join(' ').toLowerCase().includes(term));
}
export function setupRoboticsFeed(container,data,lang){
 const t=(ko,en)=>lang==='en'?en:ko,items=unifiedItems(data);
 const sources=[...new Map([...(data.sources||[]),...(data.archive?.sources||[])].map(s=>[s.id,s.name])).entries()];
 const years=[...new Set(items.map(i=>i.year))].sort((a,b)=>b-a);
 const state={source:'all',year:'all',topic:'all',kind:'all',query:''};let visible=24;
 const options=entries=>entries.map(([value,label])=>`<option value="${escape(value)}">${escape(label)}</option>`).join('');
 container.innerHTML=`<div class="research-controls"><div class="search-wrap"><span class="search-icon" aria-hidden="true">⌕</span><input id="feed-search" type="search" aria-label="${t('동향·학회 논문 통합 검색','Search updates and conference papers')}" placeholder="${t('동향·학회 논문 제목·요약 검색','Search update and conference paper titles and summaries')}"></div><div class="archive-filters"><label>${t('출처·학회','Source / conference')} <select id="feed-source">${options([['all',t('전체 출처·학회','All sources and conferences')],...sources])}</select></label><label>${t('연도','Year')} <select id="feed-year">${options([['all',t('전체 연도','All years')],...years.map(y=>[y,y])])}</select></label><label>${t('주제','Topic')} <select id="feed-topic">${options([['all',t('전체 주제','All topics')],...Object.entries(labels).map(([id,names])=>[id,t(...names)])])}</select></label><label>${t('유형','Type')} <select id="feed-kind">${options([['all',t('동향 + 학회 논문','Updates + conference papers')],['news',t('동향','Updates')],['conference',t('학회 논문','Conference papers')]])}</select></label><button class="chip" id="feed-reset">${t('초기화','Reset')}</button></div></div><div class="section-head"><h2>${t('최신순으로 보기','Newest first')}</h2><span id="research-count" aria-live="polite"></span></div><p class="research-note">${t('동향은 게시·공고일 최신순, 학회 논문은 학회 연도 최신순으로 모았습니다. 같은 연도에서는 날짜가 있는 동향이 먼저 나옵니다. 학회 논문의 개별 게시일은 추정하지 않습니다.','Updates use publication or announcement dates; conference papers use conference years. Dated updates appear first within each year. Individual conference publication dates are not inferred.')}</p><div id="research-results" class="research-results"></div><details class="archive-sources"><summary>${t('수집 범위·출처 상태','Coverage and source status')}</summary><p class="research-note">${t('공식 동향과 arXiv, 보안 4대 학회·VehicleSec의 관련 연구를 함께 검색합니다. 학회 목록은 2025년 이후와 NDSS 2024를 포함합니다. 주제는 키워드 분류이며, arXiv는 동료 심사를 보장하지 않는 프리프린트입니다. 한국어 TL;DR은 별도로 작성한 요약, 영어는 짧은 원문 발췌입니다. 수집 실패 시 저장된 목록을 유지합니다.','Search community updates, arXiv, the four major security conferences and VehicleSec together. Conference coverage includes 2025 onward and NDSS 2024. Topics are keyword-based, and arXiv preprints are not necessarily peer-reviewed. Korean TL;DRs are authored summaries; English text is a short original excerpt. Saved entries survive collection failures.')}</p>${[...(data.sources||[]),...(data.archive?.sources||[])].map(s=>`<p><a href="${escape(s.home||s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.name)} ${s.year||''} ↗</a> · ${s.status==='ok'?t('수집 정상','Collection OK'):t('갱신 확인 필요 · 저장 목록 유지','Update needs attention; saved entries retained')} · ${t('최근 성공','Last success')}: ${escape(s.last_success?.slice(0,10)||'—')}</p>`).join('')}</details>`;
 function update(reset=true){
  if(reset)visible=24;
  const matches=filterUnified(items,state);
  container.querySelector('#research-count').textContent=t(`${matches.length}개 항목`,`${matches.length} entries`);
  container.querySelector('#research-results').innerHTML=matches.slice(0,visible).map(i=>{
   const source=state.source==='all'?i.source_ids[0]:state.source,name=sources.find(([id])=>id===source)?.[1]||source;
   const badge=i.entry_kind==='conference'?t('학회 논문','CONFERENCE'):i.kind==='preprint'?'PREPRINT':i.kind==='community'?t('커뮤니티','COMMUNITY'):t('동향','UPDATE');
   return `<article class="research-item" data-entry-kind="${i.entry_kind}" data-year="${i.year}" data-source="${escape(source)}"><div class="research-item-meta"><span>${escape(name)}</span>${i.entry_kind==='conference'?`<span>${i.year} · ${t('학회 연도','Conference year')}</span>`:`<time datetime="${escape(i.date)}">${escape(i.date)}</time><small>${i.date_kind==='announced'?t('공고일','Announced'):t('게시일','Published')}</small>`}<span class="research-badge">${badge}</span></div><h3><a href="${escape(i.url)}" lang="en" target="_blank" rel="noopener noreferrer">${escape(i.title)} <span aria-hidden="true">↗</span></a></h3>${i.tldr?.ko||i.tldr?.en?renderTLDR(i,lang):''}<div class="research-tags">${i.tags.map(tag=>`<span>${escape(labels[tag]?t(...labels[tag]):tag)}</span>`).join('')}</div></article>`;
  }).join('')||`<div class="empty">${t('조건에 맞는 글이 없습니다. 검색어나 필터를 바꿔보세요.','No matching entries. Try another search or filter.')}</div>`;
  if(matches.length>visible){const button=document.createElement('button');button.className='chip research-more';button.textContent=t(`더 보기 (${matches.length-visible}개 남음)`,`Show more (${matches.length-visible} remaining)`);button.addEventListener('click',()=>{const start=visible;visible+=24;update(false);container.querySelectorAll('.research-item h3 a')[start]?.focus();});container.querySelector('#research-results').append(button);}
 }
 container.querySelector('#feed-search').addEventListener('input',e=>{state.query=e.target.value;update();});
 for(const field of ['source','year','topic','kind'])container.querySelector('#feed-'+field).addEventListener('change',e=>{state[field]=e.target.value;update();});
 container.querySelector('#feed-reset').addEventListener('click',()=>{state.query='';container.querySelector('#feed-search').value='';for(const field of ['source','year','topic','kind']){state[field]='all';container.querySelector('#feed-'+field).value='all';}update();});update();
}
