import {feedEntries,researchCard,allLabels,loadBookmarks,saveBookmarks} from './robotics-archive.js';
// Both watch feeds save into one bookmark store; this page gathers them from both data files.
const feeds=[{file:'./research.json'},{file:'./robotics-security.json'}];
export async function renderBookmarks(main,lang){
 const t=(ko,en)=>lang==='en'?en:ko;
 document.title=t('북마크','Bookmarks')+' — whateveriwant';
 document.querySelector('#breadcrumb').textContent=t('북마크','Bookmarks');
 main.innerHTML=`<p class="loading">${t('북마크를 불러오는 중…','Loading bookmarks…')}</p>`;
 const bookmarks=loadBookmarks();
 const datasets=await Promise.all(feeds.map(f=>fetch(f.file,{cache:'no-cache'}).then(r=>r.ok?r.json():null).catch(()=>null)));
 if(location.hash!=='#/bookmarks'||document.documentElement.lang!==lang)return;
 const seen=new Set(),saved=[];
 for(const data of datasets){
  if(!data)continue;
  const {items,names}=feedEntries(data);
  for(const item of items)if(bookmarks.has(item.entry_id)&&!seen.has(item.entry_id)){seen.add(item.entry_id);saved.push({item,name:names.get(item.source_ids[0])||item.source_ids[0]});}
 }
 saved.sort((a,b)=>b.item.year-a.item.year||(b.item.published_at||b.item.date||'').localeCompare(a.item.published_at||a.item.date||''));
 const header=`<section class="research-intro"><div class="eyebrow">BOOKMARKS</div><h1>${t('북마크','Bookmarks')}</h1><p>${t('AI Research Watch와 ROS Watch에서 저장한 글을 한곳에 모았습니다. 각 카드의 ★를 눌러 해제할 수 있어요.','Everything you saved from AI Research Watch and ROS Watch, in one place. Tap the ★ on a card to remove it.')}</p></section>`;
 function render(){
  if(!saved.length){main.innerHTML=header+`<div class="empty">${t('아직 북마크한 글이 없습니다. AI Research Watch나 ROS Watch에서 카드의 ☆를 눌러 저장해보세요.','No bookmarks yet. Save entries with the ☆ on cards in AI Research Watch or ROS Watch.')}</div>`;return;}
  main.innerHTML=header+`<div class="section-head"><h2>${t('저장한 글','Saved entries')}</h2><span aria-live="polite">${t(`${saved.length}개 항목`,`${saved.length} entries`)}</span></div><div id="bookmark-results" class="research-results">${saved.map(e=>researchCard(e.item,e.name,allLabels,lang,true)).join('')}</div>`;
  main.querySelector('#bookmark-results').addEventListener('click',event=>{
   const button=event.target.closest('.bookmark-toggle');if(!button)return;
   const id=button.dataset.id;bookmarks.delete(id);saveBookmarks(bookmarks);
   const index=saved.findIndex(e=>e.item.entry_id===id);if(index>=0)saved.splice(index,1);
   window.updateBookmarkCount?.();render();
  });
 }
 render();
}
