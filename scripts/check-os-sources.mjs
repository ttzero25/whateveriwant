import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
const {sources}=JSON.parse(await fs.readFile('sources/os.json','utf8'));
const normalize=s=>s.replace(/\s+/g,' ').trim();
const results=await Promise.allSettled(sources.map(async source=>{
 const response=await fetch(source.url,{signal:AbortSignal.timeout(20000)});
 assert.ok(response.ok,`${source.slug}: HTTP ${response.status}`);
 const $=load(await response.text());
 assert.ok(normalize($('body').text()).includes(normalize(source.quote)),`${source.slug}: original wording changed`);
 assert.ok(source.quote.split(/\s+/).length<=25,source.slug);
 return source.slug;
}));
for(const result of results)if(result.status==='rejected')throw result.reason;
console.log(`PASS: ${results.length} OS excerpts match live source wording.`);
