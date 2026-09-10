import {load} from 'cheerio';
import {createHash} from 'node:crypto';
export const conferences=[
 {id:'ieee-sp',name:'IEEE S&P',group:'security',year:2026,url:'https://sp2026.ieee-security.org/accepted-papers.html'},
 {id:'usenix-security',name:'USENIX Security',group:'security',year:2026,url:'https://www.usenix.org/conference/usenixsecurity26/technical-sessions'},
 {id:'acm-ccs',name:'ACM CCS',group:'security',year:2026,url:'https://www.sigsac.org/ccs/CCS2026/program/accepted-papers.html'},
 {id:'ndss',name:'NDSS',group:'security',year:2026,url:'https://www.ndss-symposium.org/ndss2026/accepted-papers/'},
 {id:'icml',name:'ICML',group:'ml',year:2026,url:'https://icml.cc/virtual/2026/papers.html',feed:'https://icml.cc/static/virtual/data/icml-2026-orals-posters.json'}
];
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const relevant=/\b(LLMs?|language models?|AI agents?|agentic|machine learning|deep learning|neural|prompt injection|jailbreak\w*|model (?:safety|security)|membership inference|unlearning)\b/i;
export function parseConference(source,text){
 const items=[],$=source.id==='icml'?null:load(text);
 function add(title,url,description='',basis='title'){
  title=clean(title);if(!title||!relevant.test(title))return;
  let link;try{link=new URL(url,source.url);if(link.protocol!=='https:'||link.hostname!==new URL(source.url).hostname)return;}catch{return;}
  const id=createHash('sha256').update(title.toLowerCase()).digest('hex').slice(0,16);
  items.push({id:source.id+':'+source.year+':'+id,title,url:link.href,basis,description:clean(description)});
 }
 if(source.id==='ieee-sp')$('.list-group-item > b > a').each((_,e)=>add($(e).text(),$(e).attr('href')));
 else if(source.id==='usenix-security')$('article.node-paper').each((_,e)=>{
  const el=$(e),a=el.find('h2 a').first();
  // Invited talks have a presented-by field rather than paper authors.
  if(!el.find('.field-name-field-paper-people-text').length)return;
  add(a.text(),a.attr('href'),el.find('.field-name-field-paper-description-long').text(),'abstract');
 });
 else if(source.id==='acm-ccs')$('table.accepted-papers-table tr').each((_,e)=>{const td=$(e).children('td').first();if(td.length)add(td.text(),source.url);});
 else if(source.id==='ndss')$('.pt-cv-title a').each((_,e)=>add($(e).text(),$(e).attr('href')));
 else if(source.id==='icml'){
  const data=JSON.parse(text);if(!Array.isArray(data.results)||data.next)throw Error('Incomplete ICML data');
  for(const row of data.results)if(/^Accept/.test(row.decision||''))add(row.name,row.virtualsite_url);
 }
 const unique=[...new Map(items.map(i=>[i.id,i])).values()].sort((a,b)=>a.title.localeCompare(b.title,'en'));
 if(!unique.length)throw Error('No matching conference papers; source layout may have changed');
 return {matched_count:unique.length,items:unique.slice(0,8)};
}
export function articleDescription(html,source){
 const $=load(html);let body='';
 if(source==='ndss')body=$('.paper-data > p').filter((_,e)=>!$(e).find('strong').length&&$(e).text().trim().length>100).map((_,e)=>$(e).text()).get().join(' ')||$('.paper-abstract,.ndss-paper-abstract').text()||$('.field-name-field-paper-description-long').text();
 if(source==='icml')body=$('.abstract-text-inner').first().text()||$('#abstract').text()||$('.abstract').text()||$('#abstractContainer').text();
 return clean(body.replace(/^\s*Abstract\s*:?\s*/i,''));
}
