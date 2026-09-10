const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const topics={incident:['침해·유출','Incidents & breaches'],vulnerability:['취약점·패치','Vulnerabilities & patches'],malware:['악성코드·랜섬웨어','Malware & ransomware'],phishing:['피싱·사칭','Phishing'],policy:['정책·권고','Policy & advisories']};
const labels={kr:['국내 출처','Korean sources'],global:['해외 출처','International sources']};
let request,loadedAt=0;
export function loadSecurityNews(){
 if(Date.now()-loadedAt>300000){request=null;loadedAt=Date.now();}
 request??=fetch('./security-news.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Load failed');return r.json();}).catch(e=>{request=null;throw e;});return request;
}
export function filterSecurityNews(items,{region='all',source='all',topic='all',days='30',query=''}={},now=Date.now()){
 const cutoff=days==='all'?-Infinity:now-Number(days)*86400000,term=query.trim().toLowerCase();
 return items.filter(i=>(region==='all'||i.region===region)&&(source==='all'||i.source===source)&&(topic==='all'||i.tags.includes(topic))&&Date.parse(i.published_at)>=cutoff&&[i.title,i.excerpt].join(' ').toLowerCase().includes(term)).sort((a,b)=>b.published_at.localeCompare(a.published_at)||a.title.localeCompare(b.title));
}
const date=value=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value));
function card(item,data,lang,compact=false){
 const t=(ko,en)=>lang==='en'?en:ko,source=data.sources.find(s=>s.id===item.source);
 return `<article class="${compact?'security-news-preview':'research-item security-news-item'}" data-region="${item.region}" data-source="${item.source}"><div class="research-item-meta"><span>${escape(source?.name||item.source)}</span><time datetime="${escape(item.published_at)}">${date(item.published_at)}</time>${!compact?`<span class="research-badge">${t(...labels[item.region])}</span>`:''}</div><h3><a href="${escape(item.url)}" lang="${item.lang}" target="_blank" rel="noopener noreferrer">${escape(item.title)} ↗</a></h3>${!compact&&item.excerpt?`<p class="security-news-excerpt" lang="${item.lang}"><small>${t('원문 발췌','Original excerpt')}</small>${escape(item.excerpt)}</p>`:''}${!compact?`<div class="research-tags">${item.tags.map(tag=>`<span>${escape(topics[tag]?t(...topics[tag]):tag)}</span>`).join('')}</div>`:''}</article>`;
}
export async function renderSecurityNews(main,lang){
 const t=(ko,en)=>lang==='en'?en:ko,active=()=>location.hash==='#/security-news'&&document.documentElement.lang===lang;
 document.title=t('보안 이슈 Watch','Security News Watch')+' — whateveriwant';document.querySelector('#breadcrumb').textContent=t('보안 이슈 Watch','Security News Watch');
 main.innerHTML=`<p class="loading">${t('보안 이슈를 불러오는 중…','Loading security news…')}</p>`;
 try{
  const data=await loadSecurityNews();if(!active())return;
  const state={region:'all',source:'all',topic:'all',days:'30',query:''};let visible=24;
  const options=rows=>rows.map(([value,label])=>`<option value="${escape(value)}">${escape(label)}</option>`).join('');
  main.innerHTML=`<section class="research-intro"><div class="eyebrow">SECURITY NEWS WATCH</div><h1>${t('보안 이슈 Watch','Security News Watch')}</h1><p>${t('국내·해외 매체와 기관의 보안 이슈를 최신순으로 확인하세요.','Follow the latest security news from Korean and international publications and agencies.')}</p><small>${t('매일 08:17 KST 갱신 예정 · 마지막 수집 시도','Scheduled daily at 08:17 KST · Last collection attempt')}: ${data.attempted_at?date(data.attempted_at):'—'}</small></section><section id="security-news-feed"><div class="research-controls"><div class="search-wrap"><span class="search-icon" aria-hidden="true">⌕</span><input id="news-search" type="search" aria-label="${t('보안 이슈 검색','Search security news')}" placeholder="${t('보안 이슈 제목·본문 발췌 검색','Search security news titles and excerpts')}"></div><div class="news-filters archive-filters"><label>${t('국내·해외','Region')} <select id="news-region">${options([['all',t('국내 + 해외','Korean + international')],...Object.entries(labels).map(([id,label])=>[id,t(...label)])])}</select></label><label>${t('출처','Source')} <select id="news-source">${options([['all',t('전체 출처','All sources')],...data.sources.map(s=>[s.id,s.name])])}</select></label><label>${t('주제','Topic')} <select id="news-topic">${options([['all',t('전체 주제','All topics')],...Object.entries(topics).map(([id,label])=>[id,t(...label)])])}</select></label><label>${t('기간','Period')} <select id="news-days">${options([['30',t('최근 30일','Last 30 days')],['7',t('최근 7일','Last 7 days')],['90',t('최근 90일','Last 90 days')],['all',t('저장된 전체','All saved')]])}</select></label><button id="news-reset" class="chip">${t('초기화','Reset')}</button></div></div><p class="research-note">${t('국내·해외는 출처 소재 기준이며 사건 발생 국가를 뜻하지 않습니다. 날짜는 KST 게시일 기준입니다. 보도·권고·분석을 함께 모으며, 제목과 짧은 원문 발췌를 제공합니다. 세부 사실과 대응 지침은 원문에서 확인하세요.','Regions describe the source’s location, not the incident’s location. Publication dates use KST. This collection includes reports, advisories and analysis, with titles and short original excerpts. Refer to original sources for details and guidance.')}</p><div class="section-head"><h2>${t('최신 보안 이슈','Latest security news')}</h2><span id="news-count" aria-live="polite"></span></div><div class="research-results" id="news-results"></div><details class="archive-sources"><summary>${t('출처·수집 상태','Sources and collection status')}</summary>${data.sources.map(s=>`<p><a href="${escape(s.home)}" target="_blank" rel="noopener noreferrer">${escape(s.name)} ↗</a> · ${t(...labels[s.region])} · ${s.status==='ok'?t('수집 정상','Collection OK'):t('갱신 확인 필요 · 저장 목록 유지','Update needs attention; showing saved entries')} · ${t('최근 성공','Last success')}: ${s.last_success?date(s.last_success):'—'}</p>`).join('')}</details></section>`;
  function update(reset=true){
   if(reset)visible=24;const matches=filterSecurityNews(data.items,state);
   main.querySelector('#news-count').textContent=t(`${matches.length}개 항목`,`${matches.length} entries`);
   main.querySelector('#news-results').innerHTML=matches.slice(0,visible).map(i=>card(i,data,lang)).join('')||`<div class="empty">${t('조건에 맞는 이슈가 없습니다. 필터나 기간을 바꿔보세요.','No matching news. Try another filter or period.')}</div>`;
   if(matches.length>visible){const b=document.createElement('button');b.className='chip research-more';b.textContent=t(`더 보기 (${matches.length-visible}개 남음)`,`Show more (${matches.length-visible} remaining)`);b.addEventListener('click',()=>{const start=visible;visible+=24;update(false);main.querySelectorAll('.security-news-item h3 a')[start]?.focus();});main.querySelector('#news-results').append(b);}
  }
  main.querySelector('#news-search').addEventListener('input',e=>{state.query=e.target.value;update();});
  for(const key of ['region','source','topic','days'])main.querySelector('#news-'+key).addEventListener('change',e=>{state[key]=e.target.value;update();});
  main.querySelector('#news-reset').addEventListener('click',()=>{state.query='';state.days='30';state.region=state.source=state.topic='all';main.querySelector('#news-search').value='';for(const key of ['region','source','topic','days'])main.querySelector('#news-'+key).value=state[key];update();});update();
 }catch{if(!active())return;main.innerHTML=`<div class="empty"><p>${t('보안 이슈를 불러오지 못했습니다.','Unable to load security news.')}</p><button class="chip" id="news-retry">${t('다시 시도','Retry')}</button></div>`;main.querySelector('#news-retry').addEventListener('click',()=>renderSecurityNews(main,lang));}
}
export async function renderSecurityBanner(container,lang){
 const t=(ko,en)=>lang==='en'?en:ko,active=()=>container.isConnected&&document.documentElement.lang===lang;
 container.innerHTML=`<p class="loading">${t('최근 보안 이슈를 불러오는 중…','Loading recent security news…')}</p>`;
 try{
  const data=await loadSecurityNews();if(!active())return;
  container.innerHTML=`<div class="updates-heading"><div><div class="eyebrow">SECURITY NEWS</div><h2>${t('국내·해외 보안 이슈','Korean & international security news')}</h2><p>${t('침해사고부터 취약점·피싱·보안 권고까지, 최근 이슈를 함께 살펴보세요.','Recent incidents, vulnerabilities, phishing and security advisories in one place.')}</p></div><a class="security-news-all" href="#/security-news">${t('보안 이슈 전체 보기','All security news')} →</a></div><div class="security-banner-grid">${Object.entries(labels).map(([region,label])=>{
   const items=filterSecurityNews(data.items,{region,days:'30'}).slice(0,3),warning=data.sources.filter(s=>s.region===region).some(s=>s.status!=='ok'||!s.last_success||Date.now()-Date.parse(s.last_success)>48*3600000);
   return `<section class="security-banner-region"><h3>${t(...label)}</h3>${warning?`<p class="feed-warning">${t('일부 출처 갱신 확인 필요 · 저장된 목록','Some sources need attention; showing saved entries')}</p>`:''}${items.map(i=>card(i,data,lang,true)).join('')||`<p>${t('최근 30일 이슈가 아직 없습니다.','No collected news from the last 30 days.')}</p>`}</section>`;
  }).join('')}</div><p class="updates-note">${t('국내·해외는 매체·기관 소재 기준 · 날짜는 KST 게시일 · 매일 자동 갱신','Region is based on source location · Publication dates in KST · Refreshed daily')}</p>`;
 }catch{if(!active())return;container.innerHTML=`<div class="updates-heading"><h2>${t('국내·해외 보안 이슈','Security news')}</h2><a class="security-news-all" href="#/security-news">${t('전체 보기','View all')} →</a></div><p>${t('최근 이슈를 불러오지 못했습니다.','Unable to load recent news.')}</p><button class="chip" data-security-banner-retry>${t('다시 시도','Retry')}</button>`;container.querySelector('[data-security-banner-retry]').addEventListener('click',()=>renderSecurityBanner(container,lang));}
}
