const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderTLDR(item,lang){
 const ko=lang!=='en',s=item.tldr||{},text=ko?s.ko:s.en;
 const label=ko?(s.basis==='title'?'제목 기반':'AI 요약'):'Original excerpt';
 if(text)return `<p class="research-tldr" lang="${ko?'ko':'en'}"><span class="tldr-label">TL;DR <small>· ${label}</small></span>${escape(text)}</p>`;
 if(ko&&s.en)return `<p class="research-tldr" lang="en"><span class="tldr-label" lang="ko">TL;DR <small>· 한국어 요약 준비 중 · 원문 발췌</small></span>${escape(s.en)}</p>`;
 return `<p class="research-tldr summary-unavailable"><span class="tldr-label">TL;DR</span>${ko?'공식 목록에 초록이 없어 내용 요약을 준비 중입니다.':'No abstract is provided in the official listing; a source excerpt is not available.'}</p>`;
}
export function setupConferences(container,conferences,lang){
 if(!conferences?.length){container.remove();return;}
 const t=(ko,en)=>lang==='en'?en:ko;
 container.innerHTML=`<div class="section-head"><h2>${t('2026 학회 논문','2026 conference papers')}</h2></div><p class="research-note">${t('보안 4대 학회: IEEE S&P · USENIX Security · ACM CCS · NDSS. ICML은 머신러닝 학회입니다. 공식 목록에서 AI 관련 키워드가 있는 제목을 골라 알파벳순 8건씩 보관합니다. 아래 뉴스 기간·검색 필터와 별도로 볼 수 있습니다.','Security conferences: IEEE S&P, USENIX Security, ACM CCS and NDSS; ICML covers machine learning. Eight alphabetically sorted titles matching AI keywords are retained per venue. This section is independent of the news filters below.')}</p><div class="research-pills conference-tabs" role="group" aria-label="${t('학회 선택','Choose conference')}">${conferences.map(c=>`<button class="chip" data-conference="${escape(c.id)}">${escape(c.name)}</button>`).join('')}</div><div class="conference-results"></div>`;
 let selected=conferences[0].id,expanded=false;
 function update(){
  const c=conferences.find(c=>c.id===selected);
  container.querySelectorAll('[data-conference]').forEach(b=>{const active=b.dataset.conference===selected;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  container.querySelector('.conference-results').innerHTML=`<div class="conference-meta"><span>${escape(c.name)} ${c.year} · ${t(`관련 제목 ${c.matched_count}건 중 ${c.items.length}건 선별`,`${c.items.length} selected from ${c.matched_count} matching titles`)}</span><a href="${escape(c.url)}" target="_blank" rel="noopener noreferrer">${t('공식 전체 목록','Official full list')} ↗</a></div>${c.status!=='ok'?`<p class="feed-warning">${t('수집 확인 필요 · 마지막 저장 목록입니다.','Collection needs attention; showing the last saved list.')}</p>`:''}<div class="conference-papers">${c.items.slice(0,expanded?8:3).map(item=>`<article class="conference-paper"><h3><a href="${escape(item.url)}" lang="en" target="_blank" rel="noopener noreferrer">${escape(item.title)} ↗</a></h3>${renderTLDR(item,lang)}</article>`).join('')||`<p>${t('아직 수집한 논문이 없습니다.','No papers collected yet.')}</p>`}</div>${c.items.length>3?`<button class="chip conference-more">${expanded?t('접기','Show fewer'):t(`나머지 ${c.items.length-3}건 보기`,`Show ${c.items.length-3} more`)}</button>`:''}<p class="research-note">${t('학회 연도 기준이며 최신 게시일 순위가 아닙니다. 요약은 초록·소개문 기반이며, 제목만 확인한 경우 별도 표시합니다.','Grouped by conference year, not publication recency. Summaries use abstracts or descriptions; title-only summaries are labeled.')} ${t('최근 수집','Last collected')}: ${escape(c.last_success?.slice(0,10)||'—')}</p>`;
  container.querySelector('.conference-more')?.addEventListener('click',()=>{expanded=!expanded;update();});
 }
 container.querySelectorAll('[data-conference]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.conference;expanded=false;update();}));update();
}
