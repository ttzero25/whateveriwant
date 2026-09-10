import fs from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {sources,parseSecurityNews} from './security-news-feeds.mjs';
import {stampCollected} from './collection-metadata.mjs';
const run=promisify(execFile),file=new URL('../data/security-news.json',import.meta.url);
let old={items:[],sources:[]};try{old=JSON.parse(await fs.readFile(file,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
const attempted_at=new Date().toISOString();
const results=await Promise.all(sources.map(async source=>{
 const previous=old.sources.find(s=>s.id===source.id),retained=old.items.filter(i=>i.source===source.id);
 try{
  const {stdout}=await run('curl',['--fail','--location','--silent','--show-error','--max-time','35',source.url],{maxBuffer:5*1024*1024});
  const fresh=parseSecurityNews(source,stdout).map(i=>stampCollected(i,retained.find(p=>p.url===i.url),attempted_at));
  const items=[...new Map([...retained,...fresh].map(i=>[i.url,i])).values()].sort((a,b)=>b.published_at.localeCompare(a.published_at)).slice(0,150);
  console.log(source.name,fresh.length+' fetched');return {source:{...source,attempted_at,last_success:attempted_at,status:'ok',count:items.length},items};
 }catch(e){console.warn(source.name,e.message.slice(0,160));return {source:{...source,attempted_at,last_success:previous?.last_success||null,status:'error',count:retained.length},items:retained};}
}));
const items=results.flatMap(r=>r.items).sort((a,b)=>b.published_at.localeCompare(a.published_at)||a.title.localeCompare(b.title));
await fs.writeFile(file,JSON.stringify({automation_enabled:true,attempted_at,sources:results.map(r=>r.source),items},null,2)+'\n');
if(!items.length)throw Error('No security news available to publish');
