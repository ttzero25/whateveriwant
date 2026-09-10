import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.argv[2]||'http://127.0.0.1:4173/';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},colorScheme:'light'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'#/research');await page.waitForSelector('.research-item');
 const data=await page.evaluate(()=>fetch('./research.json').then(r=>r.json()));
 assert.equal(data.conferences.length,5);
 assert.equal(await page.locator('.research-source-latest .research-tldr').count(),9);
 assert.equal(await page.locator('.research-item .research-tldr').count(),await page.locator('.research-item').count());
 for(const c of data.conferences){
  await page.locator('#feed-source').selectOption(c.id);
  assert.equal(await page.locator('.research-item').count(),c.items.length);
  assert.equal(await page.locator('.research-item .research-tldr').count(),c.items.length);
  assert.deepEqual(await page.locator('.research-item h3 a').evaluateAll(as=>as.map(a=>a.textContent.replace(/ ↗$/,''))),[...c.items].sort((a,b)=>a.title.localeCompare(b.title,'en')).map(i=>i.title));
 }
 await page.locator('#feed-reset').click();await page.locator('#feed-search').fill('우르두어');assert.ok(await page.locator('.research-item').count()>0);
 await page.locator('[data-language=en]').click();await page.waitForSelector('.research-item');
 assert.match(await page.locator('.research-item .research-tldr').first().innerText(),/Original excerpt/);
 await page.locator('#feed-source').selectOption('icml');assert.equal(await page.locator('.research-item .summary-unavailable').count(),0);
 await page.locator('[data-language=ko]').click();await page.waitForSelector('.research-item');
 await page.screenshot({path:'.preview/research-summaries-desktop.png',fullPage:true});
 await page.locator('#theme-toggle').click();
 for(const width of [390,320]){await page.setViewportSize({width,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 await page.screenshot({path:'.preview/research-summaries-mobile.png',fullPage:true});
 await page.goto(base);await page.waitForSelector('.update-card');assert.equal(await page.locator('.update-card .research-tldr').count(),3);
 assert.deepEqual(errors,[]);
 console.log('PASS: five conferences, 40 paper summaries, expansion, Korean summary search, original English, missing-abstract labels, home TL;DRs and dark/mobile.');
}finally{await browser.close();}
