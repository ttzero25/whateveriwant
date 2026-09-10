import test from 'node:test';
import assert from 'node:assert/strict';
import {conferences,parseConference,articleDescription} from './conference-feeds.mjs';
import {excerpt,attachSummaries} from './research-summaries.mjs';
const source=id=>conferences.find(c=>c.id===id);
test('CCS titles on a shared index remain separate, without inventing dates',()=>{
 const html='<table class="accepted-papers-table"><tr><th>Title</th></tr>'+['LLM Privacy','LLM Security','Unrelated Title'].map(t=>`<tr><td>${t}</td><td>Author</td></tr>`).join('')+'</table>';
 const {items}=parseConference(source('acm-ccs'),html);
 assert.equal(items.length,2);assert.notEqual(items[0].id,items[1].id);
 assert.equal(items[0].url,items[1].url);assert.equal(items[0].date,undefined);
});
test('IEEE anchors target real paper entries; HTML and foreign URLs are not retained',()=>{
 const html='<div class="list-group-item"><b><a href="#paper-1">LLM &amp; Privacy <span></span></a></b></div><div class="list-group-item"><b><a href="https://foreign.invalid">AI agents</a></b></div>';
 const {items}=parseConference(source('ieee-sp'),html);assert.equal(items.length,1);
 assert.equal(items[0].title,'LLM & Privacy');assert.ok(items[0].url.endsWith('#paper-1'));
});
test('ICML rejects partial responses, excludes rejected papers and deduplicates sessions',()=>{
 const row={name:'LLM Evaluation',virtualsite_url:'/virtual/2026/poster/123',decision:'Accept (regular)'};
 assert.equal(parseConference(source('icml'),JSON.stringify({results:[row,row,{...row,name:'LLM Failure',decision:'Reject'}],next:null})).items.length,1);
 assert.throws(()=>parseConference(source('icml'),JSON.stringify({results:[row],next:'page2'})));
 assert.throws(()=>parseConference(source('ndss'),'<h1>Unavailable</h1>'));
});
test('USENIX excludes invited talks and retains paper abstracts',()=>{
 const html='<article class="node-paper"><h2><a href="/paper">LLM Safety</a></h2><div class="field-name-field-paper-people-text">Authors</div><div class="field-name-field-paper-description-long">We evaluate safety.</div></article><article class="node-paper"><h2><a href="/talk">AI agents talk</a></h2></article>';
 const {items}=parseConference(source('usenix-security'),html);assert.equal(items.length,1);assert.equal(items[0].description,'We evaluate safety.');
});
test('abstract extraction excludes NDSS authors and ICML headings',()=>{
 const abstract='We evaluate model safety. '.repeat(6);
 assert.equal(articleDescription(`<div class="paper-data"><p><strong>Authors</strong></p><p>${abstract}</p></div>`,'ndss'),abstract.trim());
 assert.equal(articleDescription(`<h2>Abstract</h2><div class="abstract-text-inner">${abstract}</div>`,'icml'),abstract.trim());
});
test('English excerpts are bounded and strip arXiv metadata',()=>{
 assert.equal(excerpt('arXiv:2609.12345v1 Announce Type: new\nAbstract: We test models. More text.'),'We test models.');
 assert.ok(excerpt(Array(100).fill('word').join(' ')).split(/\s+/).length<=25);
});
test('all current rows have Korean summaries, changed publications do not inherit stale ones',async()=>{
 const fs=await import('node:fs/promises');const data=JSON.parse(await fs.readFile('data/research.json'));data.conferences=JSON.parse(await fs.readFile('data/conferences.json'));
 await attachSummaries(data);
 for(const i of [...data.items,...data.conferences.flatMap(c=>c.items)]){assert.ok(i.tldr.ko,i.title);assert.ok(!i.tldr.en||i.tldr.en.split(/\s+/).length<=25,i.title);}
 const changed={...data.items[0],excerpt:'A changed source description.',tldr:undefined};await attachSummaries({items:[changed]});assert.equal(changed.tldr.ko,'');assert.equal(changed.tldr.en,changed.excerpt);
});
