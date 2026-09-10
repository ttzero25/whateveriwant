import fs from 'node:fs/promises';
import {load} from 'cheerio';
export function excerpt(value){
 const plain=load(String(value||'')).text().replace(/^arXiv:[\s\S]*?Abstract:\s*/,'').replace(/\s+/g,' ').trim();
 if(!plain)return '';
 const sentence=plain.match(/^.*?[.!?](?=\s|$)/)?.[0]||plain;
 const words=sentence.split(/\s+/);return words.slice(0,25).join(' ')+(words.length>25?'…':'');
}
export async function attachSummaries(data){
 let summaries={};try{summaries=JSON.parse(await fs.readFile(new URL('../data/research-summaries.json',import.meta.url),'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
 for(const item of [...data.items,...(data.conferences||[]).flatMap(c=>c.items)]){
  const saved=summaries[item.id||item.url];
  if(saved?.title===item.title&&(!saved.source_date||saved.source_date===item.date)&&(!item.excerpt||saved.en===item.excerpt))item.tldr={ko:saved.ko,en:item.excerpt||saved.en||'',basis:saved.basis||item.basis||'description'};
  else item.tldr={ko:'',en:item.excerpt||'',basis:item.basis||'description'};
 }
 return data;
}
