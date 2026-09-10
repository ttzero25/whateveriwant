import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const data=JSON.parse(await fs.readFile(new URL('../dist/research.json',import.meta.url),'utf8'));
const expected=['openai','anthropic','arxiv'];
assert.deepEqual(data.sources.map(s=>s.id),expected);
assert.equal(data.conferences.length,5);
assert.ok(data.items.length,'No saved news to publish');
for(const item of [...data.items,...data.conferences.flatMap(c=>c.items)]){
 assert.ok(item.title&&item.url,'Publication metadata missing');
 assert.equal(new URL(item.url).protocol,'https:');
 assert.equal(typeof item.tldr?.ko,'string');
 assert.equal(typeof item.tldr?.en,'string');
 assert.ok(!item.tldr.en||item.tldr.en.split(/\s+/).length<=25,'Excerpt too long');
 assert.equal(item.description,undefined,'Full source body must not be published');
}
const failed=[...data.sources,...data.conferences].filter(s=>s.status!=='ok');
for(const s of failed)console.warn(`Source needs attention: ${s.id} (${s.status}); saved data retained.`);
if(process.env.GITHUB_STEP_SUMMARY){
 const entries=[...data.sources,...data.conferences];
 await fs.appendFile(process.env.GITHUB_STEP_SUMMARY,`## Research collection\n\n${data.items.length} news/preprints, ${data.conferences.flatMap(c=>c.items).length} conference papers.\n\n| Source | Status | Last success |\n|---|---|---|\n`+entries.map(s=>`| ${s.name} | ${s.status} | ${s.last_success||'Never'} |`).join('\n')+'\n\nNew Korean summaries require separate authoring; original excerpts are collected automatically.\n');
}
console.log('PASS: deployable research data and source statuses');
