import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const docs=JSON.parse(await fs.readFile('dist/documents.json','utf8'));
const cs=docs.filter(d=>d.topic==='cs');
const sources=JSON.parse(await fs.readFile('sources/cs.json','utf8')).sources;
const catalog=JSON.parse(await fs.readFile('content/cs/catalog.json','utf8'));
assert.equal(cs.length,catalog.length);
const routes=new Set(docs.map(d=>`#/${d.topic}/${d.slug}`));
assert.equal(routes.size,docs.length);
for(const doc of docs)for(const html of [doc.html,doc.en.html])for(const [,href] of html.matchAll(/href="(#[^"]+)"/g))assert.ok(href==='#/'||routes.has(href),`${doc.topic}/${doc.slug}: ${href}`);
const base=process.argv[2]||'http://127.0.0.1:4173/';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'#/cs');
 await page.waitForSelector('.doc-card');
 assert.equal(await page.locator('.doc-card').count(),cs.length);
 assert.equal(await page.locator('.cs-link.active').count(),1);
 assert.equal(await page.locator('.cs-link').count(),1);
 assert.equal(await page.locator('.track-tabs').isVisible(),false);
 await page.locator('#search').fill('ACID');
 assert.ok(await page.locator('.doc-card').count()>0);
 assert.ok(await page.locator('.doc-card').count()<cs.length);
 await page.locator('#search').fill('');
 for(const level of ['기초','핵심','참고','가이드']){
  await page.locator(`[data-filter="${level}"]`).click();
  assert.equal(await page.locator('.doc-card').count(),cs.filter(d=>d.level===level).length);
 }
 await page.locator('[data-filter="전체"]').click();
 await page.screenshot({path:'.preview/cs-desktop.png',fullPage:true});
 for(const doc of cs){
  await page.goto(base+'#/cs/'+doc.slug);
  await page.waitForFunction(title=>document.querySelector('h1')?.textContent===title,doc.title);
  assert.match(await page.locator('.article blockquote').first().innerText(),/TL;DR/);
  assert.equal(await page.locator('.back-link').getAttribute('href'),'#/cs');
  assert.equal(await page.locator('.concept-diagram').count(),sources.some(s=>s.slug===doc.slug)||doc.slug==='graphs-search'?1:0);
  for(const href of await page.locator('.article-next a').evaluateAll(as=>as.map(a=>a.getAttribute('href'))))assert.ok(href.startsWith('#/cs/'));
 }
 await page.getByRole('button',{name:'English',exact:true}).click();
 for(const doc of cs){
  await page.goto(base+'#/cs/'+doc.slug);
  await page.waitForFunction(title=>document.querySelector('h1')?.textContent===title,doc.en.title);
  assert.equal(await page.locator('.article').getAttribute('lang'),doc.en.type==='korean'?'ko':'en');
  const source=sources.find(s=>s.slug===doc.slug);
  if(source){
   assert.equal(await page.locator('.cs-original').innerText(),source.quote);
   assert.ok(await page.locator('.article a').evaluateAll((as,url)=>as.some(a=>a.href===url),source.url));
   assert.match(await page.locator('.source-link').getAttribute('href'),/sources\/cs.json$/);
  }
 }
 await page.reload();
 await page.waitForSelector('.article');
 assert.equal(await page.locator('html').getAttribute('lang'),'en');
 await page.setViewportSize({width:390,height:844});
 for(const language of ['ko','en']){
  await page.locator(`[data-language="${language}"]`).click();
  for(const doc of cs){
   await page.goto(base+'#/cs/'+doc.slug);
   await page.waitForFunction(title=>document.querySelector('h1')?.textContent===title,language==='ko'?doc.title:doc.en.title);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),language+'/'+doc.slug);
  }
 }
 await page.goto(base+'#/cs/concurrency');
 await page.waitForSelector('.concept-diagram');
 await page.screenshot({path:'.preview/cs-mobile.png',fullPage:true});
 await page.locator('#menu-toggle').click();
 assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'true');
 await page.locator('.cs-link').click();
 await page.waitForSelector('.doc-card');
 assert.equal(await page.locator('.doc-card').count(),cs.length);
 assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
 assert.deepEqual(errors,[]);
 console.log('CS PASS: catalog documents, diagrams, source excerpts, links, topic isolation, search, filters, language persistence and mobile layouts.');
}finally{await browser.close();}
