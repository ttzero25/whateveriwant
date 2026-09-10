import fs from 'node:fs/promises';
import {sources,parseFeed} from './research-feeds.mjs';
const filename=new URL('../data/research.json',import.meta.url);
let old={items:[],sources:[]};
try{old=JSON.parse(await fs.readFile(filename,'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
const attempted_at=new Date().toISOString(),results=await Promise.allSettled(sources.map(async source=>{
 const response=await fetch(source.url,{headers:{'User-Agent':'whateveriwant-research/1.0 (https://github.com/ttzero25/whateveriwant)'},signal:AbortSignal.timeout(25000)});
 if(!response.ok)throw Error('HTTP '+response.status);
 return parseFeed(source.id,await response.text());
}));
const items=[],statuses=[];
for(const [i,result] of results.entries()){
 const source=sources[i],previous=old.sources.find(s=>s.id===source.id);
 const retained=old.items.filter(item=>item.source===source.id);
 const fresh=result.status==='fulfilled'?result.value:[];
 const merged=[...new Map([...retained,...fresh].map(item=>[item.url,item])).values()];
 // Retain previous announcements across daily RSS rollovers and outages.
 merged.sort((a,b)=>b.date.localeCompare(a.date)||Number(b.tags.includes('security'))-Number(a.tags.includes('security'))||a.title.localeCompare(b.title));
 items.push(...merged.slice(0,source.id==='arxiv'?150:60));
 statuses.push({...source,attempted_at,last_success:result.status==='fulfilled'?attempted_at:previous?.last_success||null,status:result.status==='fulfilled'?'ok':'error',count:Math.min(merged.length,source.id==='arxiv'?150:60)});
 console.log(source.id,result.status==='fulfilled'?`${fresh.length} entries fetched`:`failed; retained ${retained.length} entries`);
 if(result.status==='rejected')console.error(result.reason.message);
}
items.sort((a,b)=>b.date.localeCompare(a.date)||a.source.localeCompare(b.source)||a.title.localeCompare(b.title));
await fs.writeFile(filename,JSON.stringify({automation_enabled:process.env.GITHUB_ACTIONS==='true'||old.automation_enabled===true,attempted_at,sources:statuses,items},null,2)+'\n');
if(results.every(r=>r.status==='rejected'))console.warn('All sources failed; showing previously saved data with failure status.');
