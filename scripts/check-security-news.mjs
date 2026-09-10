import {chromium} from 'playwright';import assert from 'node:assert/strict';
const base=process.argv[2]||'http://127.0.0.1:4196/';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.waitForSelector('.security-news-preview');
 assert.equal(await page.locator('.security-banner-region').count(),2);assert.equal(await page.locator('.security-news-preview').count(),6);
 assert.equal(await page.locator('.research-link + .security-news-link').count(),1);
 assert.equal(await page.locator('#home-updates + #home-security-news').count(),1);
 await page.locator('#home-security-news').evaluate(el=>el.scrollIntoView({block:'start'}));await page.screenshot({path:'.preview/security-news-home.png'});
 await page.locator('.security-news-all').click();await page.waitForSelector('.security-news-item');assert.equal(await page.locator('.security-news-link.active').count(),1);
 assert.equal(await page.locator('.security-news-item').count(),24);await page.locator('.research-more').click();assert.equal(await page.locator('.security-news-item').count(),48);
 for(const region of ['kr','global']){await page.locator('#news-region').selectOption(region);assert.ok(await page.locator('.security-news-item').count()>0);assert.ok((await page.locator('.security-news-item').evaluateAll(es=>es.map(e=>e.dataset.region))).every(r=>r===region));}
 await page.locator('#news-reset').click();for(const source of ['boannews','dailysecu','thehackernews','cisa']){await page.locator('#news-source').selectOption(source);assert.ok(await page.locator('.security-news-item').count()>0);}
 await page.locator('#news-reset').click();await page.locator('#news-topic').selectOption('vulnerability');assert.ok(await page.locator('.security-news-item').count()>0);
 await page.locator('#news-days').selectOption('7');await page.locator('#news-search').fill('no-such-news-xyz');assert.equal(await page.locator('.security-news-item').count(),0);
 await page.locator('#news-reset').click();await page.locator('[data-language=en]').click();await page.waitForSelector('.security-news-item');assert.equal(await page.locator('h1').innerText(),'Security News Watch');
 await page.locator('[data-language=ko]').click();await page.waitForSelector('.security-news-item');await page.screenshot({path:'.preview/security-news-desktop.png'});
 await page.locator('#theme-toggle').click();for(const width of [390,320]){await page.setViewportSize({width,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 await page.screenshot({path:'.preview/security-news-mobile.png'});
 await page.goto(base);await page.waitForSelector('.security-news-preview');await page.locator('#menu-toggle').click();await page.locator('.security-news-link').click();await page.waitForSelector('.security-news-item');
 const failure=await browser.newPage();await failure.route('**/security-news.json',r=>r.abort());await failure.goto(base);await failure.waitForSelector('[data-security-banner-retry]');
 await failure.unroute('**/security-news.json');await failure.locator('[data-security-banner-retry]').click();await failure.waitForSelector('.security-news-preview');
 const failedPage=await browser.newPage();await failedPage.route('**/security-news.json',r=>r.abort());await failedPage.goto(base+'#/security-news');await failedPage.waitForSelector('#news-retry');await failedPage.unroute('**/security-news.json');await failedPage.locator('#news-retry').click();await failedPage.waitForSelector('.security-news-item');
 assert.deepEqual(errors,[]);console.log('PASS: home banner, sidebar placement, domestic/international sources, filters, pagination, languages, mobile, route and retries');
}finally{await browser.close();}
