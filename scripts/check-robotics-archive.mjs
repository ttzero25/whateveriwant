import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.argv[2]||'http://127.0.0.1:4192/';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'#/robotics-security');await page.waitForSelector('.archive-paper');
 assert.equal(await page.locator('.archive-paper').count(),20);
 const years=await page.locator('.archive-paper').evaluateAll(rows=>rows.map(r=>Number(r.dataset.year)));assert.deepEqual(years,[...years].sort((a,b)=>b-a));
 await page.locator('.archive-more').click();assert.equal(await page.locator('.archive-paper').count(),40);
 for(const venue of ['ieee-sp','acm-ccs','ndss','usenix-security','vehiclesec']){
  await page.locator('#archive-venue').selectOption(venue);assert.ok(await page.locator('.archive-paper').count()>0);
  assert.ok((await page.locator('.archive-paper').evaluateAll(rows=>rows.map(r=>r.dataset.venue))).every(v=>v===venue));
 }
 await page.locator('#archive-venue').selectOption('all');await page.locator('#archive-year').selectOption('2024');await page.locator('#archive-topic').selectOption('ros');
 assert.match(await page.locator('.archive-results').innerText(),/Information-Flow Control for ROS2/);
 await page.locator('#archive-year').selectOption('2026');assert.equal(await page.locator('.archive-paper').count(),0);
 await page.locator('#archive-year').selectOption('all');await page.locator('#archive-topic').selectOption('all');await page.locator('#archive-search').fill('TAT:');assert.equal(await page.locator('.archive-paper').count(),1);
 await page.locator('#research-search').fill('nonexistent-query');assert.equal(await page.locator('.research-item').count(),0);assert.equal(await page.locator('.archive-paper').count(),1);
 await page.locator('#archive-search').fill('nonexistent-title');assert.equal(await page.locator('.archive-paper').count(),0);
 await page.locator('[data-language=en]').click();await page.waitForSelector('.archive-paper');assert.match(await page.locator('#conference-watch h2').innerText(),/Security conference archive/);
 await page.locator('[data-language=ko]').click();await page.waitForSelector('.archive-paper');
 await page.screenshot({path:'.preview/robotics-archive-desktop.png',fullPage:true});
 await page.locator('#theme-toggle').click();
 for(const width of [390,320]){await page.setViewportSize({width,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 await page.locator('#conference-watch h2').evaluate(el=>el.scrollIntoView({block:'start'}));await page.screenshot({path:'.preview/robotics-archive-mobile.png'});
 await page.locator('.archive-sources summary').click();assert.equal(await page.locator('.archive-sources a').count(),11);
 assert.deepEqual(errors,[]);console.log('PASS: newest-year archive, pagination, venue/year/topic/search filters, independent news filters, languages, mobile and source status');
}finally{await browser.close();}
