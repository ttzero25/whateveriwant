import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.argv[2]||'http://127.0.0.1:4194/';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'#/robotics-security');await page.waitForSelector('.research-item');
 assert.equal(await page.locator('#research-results').count(),1);assert.equal(await page.locator('#conference-watch,#archive-search,#research-search').count(),0);
 assert.equal(await page.locator('#robotics-feed h2').innerText(),'최신순으로 보기');
 assert.equal(await page.locator('.research-item').count(),24);await page.locator('.research-more').click();assert.equal(await page.locator('.research-item').count(),48);
 const years=await page.locator('.research-item').evaluateAll(rows=>rows.map(r=>Number(r.dataset.year)));assert.deepEqual(years,[...years].sort((a,b)=>b-a));
 for(const source of ['ros','robotics','autonomy','ieee-sp','acm-ccs','ndss','usenix-security','vehiclesec']){
  await page.locator('#feed-source').selectOption(source);assert.ok(await page.locator('.research-item').count()>0);
  assert.ok((await page.locator('.research-item').evaluateAll(rows=>rows.map(r=>r.dataset.source))).every(s=>s===source));
 }
 await page.locator('#feed-reset').click();await page.locator('#feed-kind').selectOption('conference');
 assert.ok((await page.locator('.research-item').evaluateAll(rows=>rows.map(r=>r.dataset.entryKind))).every(k=>k==='conference'));
 await page.locator('#feed-year').selectOption('2024');await page.locator('#feed-topic').selectOption('ros');
 assert.match(await page.locator('#research-results').innerText(),/Information-Flow Control for ROS2/);
 await page.locator('#feed-year').selectOption('2026');assert.equal(await page.locator('.research-item').count(),0);
 await page.locator('#feed-reset').click();await page.locator('#feed-search').fill('TAT:');assert.equal(await page.locator('.research-item').count(),1);
 await page.locator('#feed-search').fill('no-matching-title');assert.equal(await page.locator('.research-item').count(),0);
 await page.locator('#feed-reset').click();await page.locator('[data-language=en]').click();await page.waitForSelector('.research-item');assert.equal(await page.locator('#robotics-feed h2').innerText(),'Newest first');
 await page.locator('[data-language=ko]').click();await page.waitForSelector('.research-item');await page.locator('#feed-kind').selectOption('conference');
 await page.locator('#robotics-feed').evaluate(el=>el.scrollIntoView({block:'start'}));await page.screenshot({path:'.preview/unified-robotics-desktop.png'});
 await page.locator('#theme-toggle').click();for(const width of [390,320]){await page.setViewportSize({width,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 await page.locator('#robotics-feed').evaluate(el=>el.scrollIntoView({block:'start'}));await page.screenshot({path:'.preview/unified-robotics-mobile.png'});
 await page.locator('.archive-sources summary').click();assert.equal(await page.locator('.archive-sources a').count(),14);
 assert.deepEqual(errors,[]);console.log('PASS: unified card list, search and source/year/topic/type filters, chronology, pagination, languages, mobile and source status');
}finally{await browser.close();}
