import fs from 'node:fs/promises';
import {conferences,parseConference,articleDescription} from './conference-feeds.mjs';
import {excerpt} from './research-summaries.mjs';
const file=new URL('../data/conferences.json',import.meta.url);
let previous=[];try{previous=JSON.parse(await fs.readFile(file,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
const attempted_at=new Date().toISOString();
async function get(url){const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('HTTP '+r.status);return r.text();}
const result=await Promise.all(conferences.map(async source=>{
 const old=previous.find(c=>c.id===source.id);
 try{
  const parsed=parseConference(source,await get(source.feed||source.url));
  const queue=[...parsed.items];await Promise.all(Array.from({length:2},async()=>{while(queue.length){const item=queue.shift();
   if(!item.description&&['ndss','icml'].includes(source.id))try{item.description=articleDescription(await get(item.url),source.id);if(item.description)item.basis='abstract';}catch{}
   item.excerpt=excerpt(item.description);delete item.description;
   if(!item.excerpt){const cached=old?.items.find(i=>i.id===item.id&&i.title===item.title);if(cached?.excerpt){item.excerpt=cached.excerpt;item.basis=cached.basis;}}
  }}));
  console.log(source.name,parsed.items.length+' selected / '+parsed.matched_count+' matching');
  return {...source,...parsed,status:'ok',attempted_at,last_success:attempted_at};
 }catch(e){console.warn(source.name,e.message);return {...source,items:old?.items||[],matched_count:old?.matched_count||0,status:'error',attempted_at,last_success:old?.last_success||null};}
}));
await fs.writeFile(file,JSON.stringify(result,null,2)+'\n');
