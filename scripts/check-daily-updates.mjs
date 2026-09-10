import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {seoulDay,todaysItems} from '../web/daily-updates.js';
const base=process.argv[2]||'http://127.0.0.1:4192/';
const ai=JSON.parse(await fs.readFile('dist/research.json')),ros=JSON.parse(await fs.readFile('dist/robotics-security.json'));
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.waitForSelector('.daily-group');
 assert.equal(await page.locator('.daily-group').count(),3);
 assert.match(await page.locator('#home-today').innerText(),new RegExp(seoulDay()));
 const counts=[todaysItems(ai.items).length,todaysItems(ros.items).length,todaysItems(ros.archive.items).length];
 assert.deepEqual(await page.locator('.daily-group-heading>span').allTextContents(),counts.map(n=>`${n}건`));
 const group=page.locator('[data-daily-group=archive]');
 if(counts[2]>3){await group.locator('.daily-more').click();assert.equal(await group.locator('.daily-entry').count(),Math.min(9,counts[2]));}
 await page.locator('[data-language=en]').click();await page.waitForSelector('.daily-group');assert.match(await page.locator('#home-today h2').innerText(),/Today's updates/);
 await page.locator('[data-language=ko]').click();await page.waitForSelector('.daily-group');await page.screenshot({path:'.preview/home-today-desktop.png'});
 await page.locator('#theme-toggle').click();for(const width of [390,320]){await page.setViewportSize({width,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 await page.screenshot({path:'.preview/home-today-mobile.png'});
 await page.locator('[data-daily-group=robotics] .daily-all').click();await page.waitForSelector('.research-item');
 const partial=await browser.newPage();await partial.route('**/robotics-security.json',r=>r.abort());await partial.goto(base);await partial.waitForSelector('[data-daily-retry]');assert.equal(await partial.locator('.daily-group').count(),3);
 await partial.unroute('**/robotics-security.json');await partial.locator('[data-daily-retry]').click();await partial.waitForSelector('[data-daily-retry]',{state:'detached'});
 const empty=await browser.newPage();await empty.route('**/research.json',r=>r.fulfill({json:{...ai,items:[]}}));await empty.route('**/robotics-security.json',r=>r.fulfill({json:{...ros,items:[],archive:{...ros.archive,items:[]}}}));await empty.goto(base);await empty.waitForSelector('.daily-empty');assert.equal(await empty.locator('.daily-empty').count(),3);
 assert.deepEqual(errors,[]);console.log('PASS: today counts, categories, more, language, responsive layout, navigation, partial failure/retry and empty state');
}finally{await browser.close();}
