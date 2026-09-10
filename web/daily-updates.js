import {loadResearch} from './research.js';
import {loadRobotics} from './robotics.js';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function seoulDay(value=new Date()){
 const date=new Date(value);if(!Number.isFinite(date.getTime()))return '';
 return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
}
export function todaysItems(items,now=new Date()){
 const today=seoulDay(now);
 return [...new Map(items.map(item=>[item.id||item.url,item])).values()].flatMap(item=>{
  for(const [value,reason] of [[item.updated_at,'changed'],[item.first_seen,'added'],[item.published_at||item.date,'published']]){
   if(value&&(value.length===10?value:seoulDay(value))===today)return [{...item,today_reason:reason,today_at:value}];
  }
  return [];
 }).sort((a,b)=>b.today_at.localeCompare(a.today_at)||a.title.localeCompare(b.title));
}
export async function renderDailyUpdates(container,lang){
 const t=(ko,en)=>lang==='en'?en:ko,active=()=>container.isConnected&&document.documentElement.lang===lang;
 const today=seoulDay();
 container.innerHTML=`<p class="loading" role="status">${t('오늘 업데이트를 불러오는 중…',"Loading today's updates…")}</p>`;
 const results=await Promise.allSettled([loadResearch(),loadRobotics()]);if(!active())return;
 const ai=results[0].status==='fulfilled'?results[0].value:null,robotics=results[1].status==='fulfilled'?results[1].value:null;
 const groups=[
  {id:'ai',name:'AI Research Watch',href:'#/research',data:ai,items:ai?.items||[]},
  {id:'robotics',name:t('ROS·자율주행 보안','ROS & autonomous security'),href:'#/robotics-security',data:robotics,items:robotics?.items||[]},
  {id:'archive',name:t('보안 학회 아카이브','Security conference archive'),href:'#/robotics-security',data:robotics?.archive,items:robotics?.archive?.items||[]}
 ].map(g=>({...g,items:todaysItems(g.items)}));
 const count=groups.reduce((sum,g)=>sum+g.items.length,0),partial=groups.some(g=>!g.data);
 container.innerHTML=`<div class="updates-heading"><div><div class="eyebrow">TODAY'S UPDATES</div><h2>${t('오늘 업데이트',"Today's updates")}</h2><p><time datetime="${today}">${today}</time> · KST · ${t(`${count}건${partial?' 확인 · 일부 목록 불러오기 실패':''}`,`${count} updates${partial?' found · some lists unavailable':''}`)}</p></div></div><p class="updates-note">${t('오늘 사이트에 새로 수집되거나 내용이 바뀐 글, 오늘 게시·공고된 소식을 함께 모았습니다. 학회 논문의 연도와 사이트 추가일은 다릅니다.','Newly collected, changed, or published/announced today. A conference paper’s year differs from the date it was added here.')}</p><div class="daily-grid">${groups.map(g=>`<section class="daily-group" data-daily-group="${g.id}"><div class="daily-group-heading"><h3>${escape(g.name)}</h3><span>${g.data?t(`${g.items.length}건`,`${g.items.length}`):'—'}</span></div><div class="daily-entries"></div><a class="daily-all" href="${g.href}">${t('전체 목록 보기','View full collection')} →</a></section>`).join('')}</div>${partial?`<button class="chip" data-daily-retry>${t('불러오지 못한 목록 다시 시도','Retry unavailable lists')}</button>`:''}`;
 for(const g of groups){
  const target=container.querySelector(`[data-daily-group="${g.id}"] .daily-entries`);let visible=3;
  function update(){
   target.innerHTML=g.items.slice(0,visible).map(i=>`<article class="daily-entry"><div class="research-item-meta"><span>${i.today_reason==='added'?t('오늘 새로 수집','Collected today'):i.today_reason==='changed'?t('오늘 내용 변경','Changed today'):t('오늘 게시·공고','Published / announced today')}</span>${i.year?`<span>${i.year} · ${t('학회 연도','Conference year')}</span>`:i.date?`<time datetime="${escape(i.today_reason==='published'?(i.published_at||i.date):i.date)}">${i.today_reason==='published'?today:escape(t('원문 ','Source ')+i.date)}</time>`:''}</div><h4><a href="${escape(i.url)}" target="_blank" rel="noopener noreferrer" lang="en">${escape(i.title)} ↗</a></h4>${i.tldr?.ko&&lang==='ko'?`<p>${escape(i.tldr.ko)}</p>`:''}</article>`).join('')||`<p class="daily-empty">${g.data?t('오늘 해당하는 글이 아직 없습니다.','No updates for today yet.'):t('목록을 불러오지 못했습니다.','Unable to load this collection.')}</p>`;
   if(g.items.length>visible){const b=document.createElement('button');b.className='chip daily-more';b.textContent=t(`더 보기 (${g.items.length-visible}건 남음)`,`Show more (${g.items.length-visible} remaining)`);b.addEventListener('click',()=>{const start=visible;visible+=6;update();target.querySelectorAll('h4 a')[start]?.focus();});target.append(b);}
  }
  update();
 }
 container.querySelector('[data-daily-retry]')?.addEventListener('click',()=>renderDailyUpdates(container,lang));
}
