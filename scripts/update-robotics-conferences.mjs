import {stampCollected} from './collection-metadata.mjs';
import fs from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {archiveSources,parseArchive,mergeArchive,topicsFor} from './robotics-conferences.mjs';
import {excerpt} from './research-summaries.mjs';
const run=promisify(execFile),file=new URL('../data/robotics-conferences.json',import.meta.url);
let old={sources:[],items:[]};try{old=JSON.parse(await fs.readFile(file,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
const attempted_at=new Date().toISOString(),sources=archiveSources(),statuses=[],fresh=[];
// A bounded queue avoids issuing one request per archived paper or overloading a venue.
const queue=[...sources];
await Promise.all(Array.from({length:3},async()=>{while(queue.length){
 const source=queue.shift(),previous=old.sources.find(s=>s.id===source.id&&s.year===source.year);
 try{
  const {stdout}=await run('curl',['--fail','--location','--silent','--show-error','--max-time','40',source.feed||source.url],{maxBuffer:20*1024*1024});
  const items=parseArchive(source,stdout).map(item=>{const result={...item,excerpt:excerpt(item.description)};delete result.description;return stampCollected(result,old.items.find(i=>i.id===item.id),attempted_at);});
  fresh.push(...items);statuses.push({...source,status:'ok',attempted_at,last_success:attempted_at,matched_count:items.length});
  console.log(source.name,source.year,items.length+' matching papers');
 }catch(e){statuses.push({...source,status:'error',attempted_at,last_success:previous?.last_success||null,matched_count:previous?.matched_count||0});console.warn(source.name,source.year,e.message.slice(0,200));}
}}));
const items=mergeArchive(old.items,fresh).filter(i=>topicsFor(i.title,i.venue).length);
statuses.sort((a,b)=>b.year-a.year||a.id.localeCompare(b.id));
await fs.writeFile(file,JSON.stringify({attempted_at,sources:statuses,items},null,2)+'\n');
if(!items.length)throw Error('No conference archive available');
