import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {relatedConcepts} from '../web/home-updates.js';
const base=process.argv[2]||'http://127.0.0.1:4173/';
const docs=JSON.parse(await fs.readFile('dist/documents.json'));
const data=JSON.parse(await fs.readFile('dist/research.json'));
assert.equal(relatedConcepts({title:'Security Pitfalls of Next Edit Suggestions in AI-Integrated IDEs',tags:['security']},docs)[0].slug,'secure-development');
assert.equal(relatedConcepts({title:'Agent prompt injection',tags:['security']},docs)[0].slug,'securing-ai-systems');
for(const item of data.items)assert.equal(relatedConcepts(item,docs).length,2);
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:1000});
  await page.goto(base);
  await page.waitForSelector('.update-card');
  for(const language of ['ko','en']){
   await page.locator(`[data-language="${language}"]`).click();
   await page.waitForSelector('.update-card');
   assert.equal(await page.locator('.update-card').count(),3);
   assert.deepEqual(await page.locator('.update-card .research-item-meta>span:first-child').allTextContents(),['OpenAI','Anthropic','arXiv']);
   assert.equal(await page.locator('.topic-grid').count(),0);
   assert.equal(await page.locator('#home-search-results').isVisible(),false);
   assert.ok(await page.evaluate(()=>document.querySelector('#search').closest('.search-wrap').nextElementSibling.id==='home-today'));
   for(const href of await page.locator('.update-concepts a').evaluateAll(as=>as.map(a=>a.getAttribute('href'))))assert.ok(docs.some(d=>href===`#/${d.topic}/${d.slug}`));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  await page.screenshot({path:`.preview/home-updates-${width}.png`,fullPage:true});
  await page.locator('#search').fill('CAN');await page.waitForSelector('.doc-card');
  assert.equal(await page.locator('.doc-card[href="#/network/can-bus"]').count(),1);
  await page.locator('#search').fill('zz-no-match-9911');assert.equal(await page.locator('.doc-card').count(),0);
  await page.locator('#search').fill('');assert.equal(await page.locator('#home-search-results').isVisible(),false);
 }
 await page.locator('.update-concepts a').first().click();await page.waitForSelector('.article');
 await page.locator('.breadcrumb a').click();await page.waitForSelector('.update-card');
 await page.locator('.updates-all').click();await page.waitForSelector('.research-item');
 await page.goto(base+'#/network');await page.waitForSelector('.doc-card');
 assert.equal(await page.locator('.doc-card').count(),22);
 assert.equal(await page.locator('.section-head').count(),0);
 assert.deepEqual(errors,[]);
 // Exercise empty, failed and delayed data independently of the live feed.
 const empty=await browser.newPage();
 await empty.route('**/research.json',r=>r.fulfill({json:{...data,items:[]}}));
 await empty.goto(base);await empty.waitForSelector('.updates-empty');
 const failure=await browser.newPage();
 await failure.route('**/research.json',r=>r.abort());
 await failure.goto(base);await failure.waitForSelector('[data-updates-retry]');
 await failure.unroute('**/research.json');await failure.locator('[data-updates-retry]').click();await failure.waitForSelector('.update-card');
 const slow=await browser.newPage();let release;
 const gate=new Promise(resolve=>{release=resolve;});
 await slow.route('**/research.json',async r=>{await gate;await r.fulfill({json:data});});
 await slow.goto(base);await slow.waitForSelector('#home-updates');
 await slow.evaluate(()=>location.hash='#/network/can-bus');await slow.waitForSelector('.article');
 release();await slow.waitForResponse('**/research.json');
 assert.equal(await slow.locator('#home-updates').count(),0);
 assert.equal(await slow.locator('.article').count(),1);
 console.log('PASS: home banner, related concepts, search, category navigation, languages, mobile, empty/error/retry and stale navigation responses.');
}finally{await browser.close();}
