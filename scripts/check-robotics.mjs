import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.argv[2]||'http://127.0.0.1:4173/';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'#/');await page.waitForSelector('#search');
 await page.locator('.robotics-link').click();await page.waitForSelector('.research-item');
 assert.match(await page.locator('h1').innerText(),/ROS & Autonomous/);
 assert.equal(await page.locator('.robotics-link.active').count(),1);
 assert.equal(await page.locator('.research-source').count(),3);
 await page.locator('#research-period').selectOption('all');
 for(const source of ['ros','robotics','autonomy']){
  await page.locator(`[data-source=${source}]`).click();assert.ok(await page.locator('.research-item').count()>0);
 }
 await page.locator('[data-source=all]').click();
 await page.locator('[data-topic=ros]').click();assert.ok(await page.locator('.research-item').count()>0);
 await page.locator('#research-search').fill('no-such-title-xyz');assert.equal(await page.locator('.research-item').count(),0);
 await page.locator('#research-search').fill('');await page.locator('[data-topic=all]').click();
 await page.locator('[data-language=en]').click();await page.waitForSelector('.research-item');
 assert.match(await page.locator('.research-intro').innerText(),/autonomous driving security/);
 await page.locator('[data-language=ko]').click();await page.waitForSelector('.research-item');
 await page.screenshot({path:'.preview/robotics-desktop.png',fullPage:true});
 await page.locator('#theme-toggle').click();
 for(const width of [390,320]){
  await page.setViewportSize({width,height:568});
  await page.goto(base+'#/');await page.waitForSelector('#search');
  await page.locator('#menu-toggle').click();await page.locator('.robotics-link').click();
  await page.waitForSelector('.research-item');
  assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 await page.screenshot({path:'.preview/robotics-mobile.png',fullPage:true});
 await page.goto(base+'#/research');await page.waitForSelector('.research-item');
 assert.match(await page.locator('h1').innerText(),/^AI Research/);
 assert.equal(await page.locator('[data-topic=all]').getAttribute('aria-pressed'),'true');
 const failure=await browser.newPage();await failure.route('**/robotics-security.json',r=>r.abort());
 await failure.goto(base+'#/robotics-security');await failure.waitForSelector('#research-retry');
 await failure.unroute('**/robotics-security.json');await failure.locator('#research-retry').click();await failure.waitForSelector('.research-item');
 assert.deepEqual(errors,[]);console.log('PASS: robotics navigation, independent filters, search, bilingual display, mobile layout and retry');
}finally{await browser.close();}
