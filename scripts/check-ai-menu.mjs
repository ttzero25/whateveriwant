import {chromium} from 'playwright';import assert from 'node:assert/strict';
const base=process.argv[2]||'http://127.0.0.1:4194/';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  await page.goto(base);await page.waitForSelector('#search');if(width<760)await page.locator('#menu-toggle').click();
  assert.equal(await page.locator('#ai-expand').count(),0);const menu=page.locator('button.ai-link');
  await menu.click();assert.equal(await menu.getAttribute('aria-expanded'),'false');assert.equal(await page.locator('#ai-subnav').isVisible(),false);
  if(width<760)assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'true');
  await menu.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#ai-subnav').isVisible(),true);
  assert.equal(await page.locator('#ai-subnav a').count(),4);
  await page.locator('#ai-subnav a[href="#/ai"]').click();await page.waitForSelector('.doc-card');
  if(width<760)await page.locator('#menu-toggle').click();
  await menu.click();await page.reload();await page.waitForSelector('.doc-card');
  assert.equal(await page.locator('button.ai-link').getAttribute('aria-expanded'),'false');assert.equal(await page.locator('#ai-subnav').isVisible(),false);
  if(width<760)await page.locator('#menu-toggle').click();await page.locator('button.ai-link').click();
  await page.locator('#ai-subnav a[href="#/ml"]').click();await page.waitForSelector('.doc-card');assert.ok(page.url().endsWith('#/ml'));
  await page.close();
 }
 console.log('PASS: AI menu click/keyboard toggle, no arrow button, mobile stays open, persisted state, all-AI and ML navigation');
}finally{await browser.close();}
