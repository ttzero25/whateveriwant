import {load} from 'cheerio';
export const sources=[
 {id:'openai',name:'OpenAI',url:'https://openai.com/news/rss.xml',home:'https://openai.com/news/'},
 {id:'anthropic',name:'Anthropic',url:'https://www.anthropic.com/research',urls:['https://www.anthropic.com/research','https://www.anthropic.com/news'],home:'https://www.anthropic.com/news'},
 {id:'arxiv',name:'arXiv',url:'https://rss.arxiv.org/rss/cs.CR+cs.AI+cs.LG',home:'https://arxiv.org/list/cs.CR/recent'}
];
const clean=s=>s.replace(/\s+/g,' ').trim();
const security=/\b(cyber\w*|secur\w*|prompt injection|jailbreak\w*|adversarial|poison\w*|backdoor\w*|privacy|phishing|malware|vulnerabilit\w*|threat\w*|cryptograph\w*)\b/i;
const safety=/\b(safe\w*|alignment|safeguard\w*|misuse|interpretabil\w*|decept\w*|red.team|risk\w*)\b/i;
const evaluation=/\b(eval\w*|benchmark\w*|robust\w*|reliab\w*)\b/i;
export function classify(text){return [...(security.test(text)?['security']:[]),...(safety.test(text)?['safety']:[]),...(evaluation.test(text)?['evaluation']:[])];}
export function safeURL(value,source){try{const u=new URL(value,sources.find(s=>s.id===source).url);const hosts={openai:['openai.com'],anthropic:['www.anthropic.com','anthropic.com'],arxiv:['arxiv.org']};return u.protocol==='https:'&&hosts[source].includes(u.hostname)?u.href:null;}catch{return null;}}
export function parseFeed(source,text,feedURL=sources.find(s=>s.id===source).url){
 const $=load(text,{xmlMode:source!=='anthropic'}),items=[];
 function add(title,url,date,categories='',hint=''){
  const link=safeURL(url,source),time=Date.parse(source==='anthropic'&&!/^\d{4}-\d{2}-\d{2}T/.test(date)?date+' UTC':date);
  if(!title||!link||!Number.isFinite(time)||time>Date.now()+86400000)return;
  const tags=classify(title+' '+categories);
  if(source==='arxiv'&&(/\bcs\.CR\b/.test(categories)||/\b(prompt injection|jailbreaks?|data poisoning|backdoors?|membership inference|model extraction|cybersecurity|malware|phishing)\b/i.test(hint))&&!tags.includes('security'))tags.unshift('security');
  items.push({source,title:clean(title),url:link,published_at:new Date(time).toISOString(),category:clean(categories),channel:source==='arxiv'?'papers':source==='anthropic'?(feedURL.includes('/news')?'news':'research'):(/research/i.test(categories)?'research':'news'),date:new Date(time).toISOString().slice(0,10),date_kind:source==='arxiv'?'announced':'published',kind:source==='arxiv'?'preprint':'official',tags:tags.length?tags:['research']});
 }
 if(source==='anthropic'){
  $('a').has('time').each((_,a)=>{
   const el=$(a),date=el.find('time').first();
   const title=el.find('[class*="__title"]').first().text()||el.find('h2,h3,h4').first().text()||$('a').filter((_,other)=>$(other).attr('href')===el.attr('href')).find('h2,h3,h4').first().text();
   add(title,el.attr('href'),date.attr('datetime')||date.text(),el.find('[class*="__subject"]').text());
  });
  if(!items.length)throw Error('No dated research publications found');
 }else{
  if(!$('rss,feed').length)throw Error('Invalid feed document');
  $('item').each((_,item)=>{
   const el=$(item),title=el.find('title').first().text(),categories=el.find('category').map((_,e)=>$(e).text()).get().join(' ');
   const hint=el.find('description').text();
   // Abstracts are used only for tagging, never stored or rendered.
   const before=items.length;
   add(title,el.find('link').text(),el.find('pubDate').text(),categories,source==='arxiv'?hint:'');
   if(source==='arxiv'&&items.length>before)items.at(-1).announcement=el.find('arxiv\\:announce_type').text()||'unspecified';
  });
  if($('item').length&&!items.length)throw Error('No usable dated entries');
 }
 return [...new Map(items.map(item=>[item.url,item])).values()];
}
