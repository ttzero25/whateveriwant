import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const data=JSON.parse(await fs.readFile(new URL('../dist/research.json',import.meta.url),'utf8'));
const robotics=JSON.parse(await fs.readFile(new URL('../dist/robotics-security.json',import.meta.url),'utf8'));
assert.deepEqual(robotics.sources.map(s=>s.id),['ros','robotics','autonomy']);
assert.ok(robotics.items.length,'No saved robotics updates to publish');
for(const item of robotics.items)assert.ok(item.tags.every(tag=>['security','ros','autonomy','sensors'].includes(tag)));
assert.ok(robotics.archive.items.length,'Conference archive is empty');
assert.equal(new Set(robotics.archive.items.map(i=>i.id)).size,robotics.archive.items.length);
for(const [index,item] of robotics.archive.items.entries()){
 assert.ok(robotics.archive.sources.some(s=>s.id===item.venue&&s.year===item.year));
 assert.ok(item.tags.length&&item.tags.every(t=>['autonomy','vehicle','ros','physical'].includes(t)));
 assert.equal(item.date,undefined,'Do not invent paper publication dates');
 if(index)assert.ok(robotics.archive.items[index-1].year>=item.year);
}
const expected=['openai','anthropic','arxiv'];
assert.deepEqual(data.sources.map(s=>s.id),expected);
assert.equal(data.conferences.length,5);
assert.ok(data.items.length,'No saved news to publish');
for(const item of [...data.items,...robotics.items,...robotics.archive.items,...data.conferences.flatMap(c=>c.items)]){
 assert.ok(item.title&&item.url,'Publication metadata missing');
 assert.equal(new URL(item.url).protocol,'https:');
 assert.equal(typeof item.tldr?.ko,'string');
 assert.equal(typeof item.tldr?.en,'string');
 assert.ok(!item.tldr.en||item.tldr.en.split(/\s+/).length<=25,'Excerpt too long');
 assert.equal(item.description,undefined,'Full source body must not be published');
}
const failed=[...data.sources,...robotics.sources,...data.conferences].filter(s=>s.status!=='ok');
for(const s of failed)console.warn(`Source needs attention: ${s.id} (${s.status}); saved data retained.`);
if(process.env.GITHUB_STEP_SUMMARY){
 const entries=[...data.sources,...robotics.sources,...data.conferences];
 await fs.appendFile(process.env.GITHUB_STEP_SUMMARY,`## Research collection\n\n${data.items.length} news/preprints, ${data.conferences.flatMap(c=>c.items).length} conference papers.\n\n| Source | Status | Last success |\n|---|---|---|\n`+entries.map(s=>`| ${s.name} | ${s.status} | ${s.last_success||'Never'} |`).join('\n')+'\n\nNew Korean summaries require separate authoring; original excerpts are collected automatically.\n');
}
console.log('PASS: deployable research data and source statuses');

const securityNews=JSON.parse(await fs.readFile(new URL('../dist/security-news.json',import.meta.url),'utf8'));
assert.equal(securityNews.sources.length,4);
assert.ok(securityNews.items.some(i=>i.region==='kr')&&securityNews.items.some(i=>i.region==='global'));
for(const item of securityNews.items){
 const source=securityNews.sources.find(s=>s.id===item.source);assert.ok(source);
 assert.ok(source.hosts.includes(new URL(item.url).hostname));assert.equal(new URL(item.url).protocol,'https:');
 assert.equal(item.region,source.region);assert.ok(Number.isFinite(Date.parse(item.published_at)));
 assert.ok(item.excerpt.split(/\s+/).length<=25);assert.equal(item.description,undefined);
}
console.log('PASS: security news sources, dates, bounded excerpts and domestic/international coverage');
