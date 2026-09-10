import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.argv[2]||'http://127.0.0.1:4173/';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},colorScheme:'light',reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'#/research');await page.waitForSelector('.research-item');
 assert.equal(await page.locator('#quick-links').count(),0);
 assert.equal(await page.locator('.research-link.active').count(),1);
 assert.equal(await page.locator('.research-source').count(),3);
 assert.equal(await page.locator('[data-topic=all]').getAttribute('aria-pressed'),'true');
 assert.equal(await page.locator('.research-source-latest li').count(),9);
 assert.equal((await page.locator('.research-link').innerText()).replace(/\s+/g,' '),'◉ AI Research Watch');
 await page.locator('[data-topic="all"]').click();
 await page.locator('#research-period').selectOption('all');
 for(const source of ['openai','anthropic','arxiv']){
  await page.locator(`[data-source="${source}"]`).click();
  assert.ok(await page.locator('.research-item').count()>0,source);
  assert.ok((await page.locator('.research-item-meta>span:first-child').allTextContents()).every(name=>name.toLowerCase()===source));
 }
 await page.locator('[data-source="all"]').click();
 await page.locator('#research-search').fill('this-title-does-not-exist-xyz');assert.equal(await page.locator('.research-item').count(),0);
 await page.locator('#research-search').fill('');
 await page.locator('[data-topic="security"]').click();
 await page.locator('#research-period').selectOption('30');
 await page.screenshot({path:'.preview/research-light.png',fullPage:true});
 await page.locator('[data-language="en"]').click();await page.waitForSelector('.research-item');
 assert.match(await page.locator('h1').innerText(),/AI Research Watch/);
 await page.locator('#theme-toggle').click();
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 await page.screenshot({path:'.preview/research-mobile.png',fullPage:true});
 await page.goto(base+'#/os/virtual-memory');await page.waitForSelector('.article');
 assert.equal(await page.locator('.research-link.active').count(),0);
 assert.deepEqual(errors,[]);
 const failure=await browser.newPage();await failure.route('**/research.json',route=>route.abort());
 await failure.goto(base+'#/research');await failure.waitForSelector('#research-retry');
 await failure.unroute('**/research.json');await failure.locator('#research-retry').click();await failure.waitForSelector('.research-item');
 console.log('PASS: sources, topics, periods, search, English, dark/mobile, quick-links removal, article navigation and load failure recovery.');
}finally{await browser.close();}
