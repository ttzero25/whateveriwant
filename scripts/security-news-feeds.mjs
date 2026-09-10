import {load} from 'cheerio';
import {excerpt} from './research-summaries.mjs';
export const sources=[
 {id:'boannews',name:'보안뉴스',region:'kr',lang:'ko',home:'https://www.boannews.com/',url:'https://cdn.boannews.com/rss/gn_rss_allArticle.xml',hosts:['www.boannews.com','boannews.com']},
 {id:'dailysecu',name:'데일리시큐',region:'kr',lang:'ko',home:'https://www.dailysecu.com/',url:'https://www.dailysecu.com/rss/allArticle.xml',hosts:['www.dailysecu.com','dailysecu.com']},
 {id:'thehackernews',name:'The Hacker News',region:'global',lang:'en',home:'https://thehackernews.com/',url:'https://feeds.feedburner.com/TheHackersNews',hosts:['thehackernews.com']},
 {id:'cisa',name:'CISA',region:'global',lang:'en',home:'https://www.cisa.gov/news-events/cybersecurity-advisories',url:'https://www.cisa.gov/cybersecurity-advisories/all.xml',hosts:['www.cisa.gov','cisa.gov']}
];
export function classifyNews(text){
 const rules={incident:/침해|해킹|유출|탈취|침투|breach|compromis|cyber.?attack|intrusion/i,vulnerability:/취약|패치|제로데이|CVE-|vulnerabilit|patch|zero.day|\bflaws?\b/i,malware:/악성|랜섬웨어|멀웨어|ransomware|malware|trojan|botnet/i,phishing:/피싱|스미싱|사칭|phishing|smishing|impersonat/i,policy:/정책|규제|법안|과징금|개인정보보호|보안 권고|advisory|advisories|regulat|sanction|privacy/i};
 return Object.entries(rules).filter(([,re])=>re.test(text)).map(([id])=>id);
}
export function parseSecurityNews(source,text){
 const $=load(text,{xmlMode:true});if(!$('rss,feed').length)throw Error('Invalid RSS document');
 let valid=0;const items=[];
 $('item').each((_,e)=>{
  const el=$(e),title=el.find('title').first().text().replace(/\s+/g,' ').trim();
  let url;try{url=new URL(el.find('link').first().text());if(!['https:','http:'].includes(url.protocol)||!source.hosts.includes(url.hostname))return;url.protocol='https:';}catch{return;}
  let date=el.find('pubDate').first().text().trim();
  if(source.region==='kr'&&/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(date))date=date.replace(' ','T')+'+09:00';
  const time=Date.parse(date);if(!title||!Number.isFinite(time)||time>Date.now()+86400000)return;valid++;
  if(/연재소설|정보보안 소설|sponsored|webinar/i.test(title))return;
  const description=el.find('description').first().text(),plain=load(description).text();
  const tags=classifyNews(title+' '+plain);
  if(!tags.length&&source.id!=='cisa')return;
  items.push({source:source.id,region:source.region,lang:source.lang,title,url:url.href,published_at:new Date(time).toISOString(),date:new Date(time).toISOString().slice(0,10),tags:tags.length?tags:['vulnerability'],excerpt:excerpt(description)});
 });
 if(!valid)throw Error('No usable dated entries');
 return [...new Map(items.map(i=>[i.url,i])).values()];
}
